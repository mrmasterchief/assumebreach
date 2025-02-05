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
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userRole = req.user.role;

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
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded as { id: string; role: RBAC };
    next();
  });
};
