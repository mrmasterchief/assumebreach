import { Request, Response, NextFunction } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";

export enum RBAC {
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: RBAC;
      };
    }
  }
}

export const authorize = (
  allowedRoles: RBAC[]
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await authenticate(req, res);

    if (!user) {
      return;
    }

    const userRole = user.role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};

export interface UserPayload extends JwtPayload {
  id: string;
  role: RBAC;
}

export const generateTokens = (
  payload: UserPayload
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: payload.role === RBAC.USER ? "7d" : "1h",
  });

  return { accessToken, refreshToken };
};

export const authenticate = async (req: Request, res: Response): Promise<{ id: string; role: RBAC } | null> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "No token provided" });
    return null;
  }

  try {
    const decoded = await new Promise<{ id: string; role: RBAC }>((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err || !decoded) return reject(err);
        resolve(decoded as { id: string; role: RBAC });
      });
    });

    req.user = decoded;
    return decoded;
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return null;
  }
};