import express from "express";
import type { Request, Response } from "express";
import { findUserByEmail, createUser, isTokenBlacklisted, blacklistToken } from "../controllers/auth";
import { generateTokens } from "../middleware/rbac";
import bcrypt from "bcryptjs";
import { UserPayload, RBAC } from "../middleware/rbac";
import jwt from "jsonwebtoken";
import createAdminAccount from "../data/adminAccount";
const router = express.Router();

createAdminAccount();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password, cms } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordhash);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (cms && user.role !== RBAC.ADMIN) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const payload: UserPayload = {
      id: user.id,
      role: user.role as RBAC,
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({ message: "Login successful" });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = await createUser(email, password, name, RBAC.USER);
    const payload: UserPayload = {
      id: newUser.id,
      role: newUser.role as RBAC,
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({ message: "Registration successful" });
    return;
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
});

router.post("/refresh-token", (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is missing" });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(401).json({ message: "Invalid or expired refresh token" });
        return;
      }

      isTokenBlacklisted(refreshToken).then((blacklisted) => {
        if (blacklisted) {
          res.clearCookie("accessToken");
          res.clearCookie("refreshToken");
          res.status(401).json({ message: "Invalid token" });
          return;
        }
      });

      const payload: UserPayload = {
        id: decoded!.id,
        role: decoded!.role,
      };
      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(payload);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ role: payload.role });
    }
  );
});

router.post("/logout", (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is missing" });
    return;
  }

  blacklistToken(refreshToken).then(() => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logout successful" });
  });
});

export default router;
