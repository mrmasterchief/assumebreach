import csurf from "csurf";
import { Request, Response, NextFunction } from "express";

export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  },
})
