import { doubleCsrf } from "csrf-csrf";

const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: "csrfToken",
    cookieOptions: {
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  });

const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === invalidCsrfTokenError) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next(err);
};

export { generateToken, doubleCsrfProtection, csrfErrorHandler };
