import { doubleCsrf } from "csrf-csrf";
import { Request, Response, NextFunction } from "express";

const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "defaultSecret",
    cookieName: "__HOST-csrfToken",
    cookieOptions: {
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  });

interface CsrfError extends Error {
  code: string;
}

const csrfErrorHandler = (err: CsrfError, req: Request, res: Response, next: NextFunction) => {
  if (err.code === invalidCsrfTokenError.code) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next(err);
};

export { generateToken, doubleCsrfProtection, csrfErrorHandler };
