import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

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
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = authenticate(req, res);

    const userRole = user?.role as RBAC;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
      return;
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
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const authenticate = (
  req: Request,
  res: Response,
) => {
  const refreshToken = req.cookies.refreshToken;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return req.user = decoded as { id: string; role: RBAC };
  });
  return req.user;
};
