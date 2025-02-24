import express from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  isTokenBlacklisted,
  blacklistToken,
} from "../controllers/auth";
import { generateTokens } from "../middleware/rbac";
import { UserPayload, RBAC } from "../middleware/rbac";
import createAdminAccount from "../data/adminAccount";
import setAuthCookies from "../helpers/setAuthCookies";

const router = express.Router();

createAdminAccount();


router.post("/login", async (req: Request, res: Response) => {
  const { email, password, cms } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return; // Correct: res.status then return
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

    setAuthCookies(res, accessToken, refreshToken);

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
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = await createUser(email, password, name, RBAC.USER);
    const payload: UserPayload = {
      id: newUser.id,
      role: newUser.role as RBAC,
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    setAuthCookies(res, accessToken, refreshToken);

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
    async (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(401).json({ message: "Invalid or expired refresh token" });
        return;
      }

      const blacklisted = await isTokenBlacklisted(refreshToken);
      if (blacklisted) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      const payload: UserPayload = {
        id: decoded!.id,
        role: decoded!.role,
      };
      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(payload);

      setAuthCookies(res, accessToken, newRefreshToken);

      res.json({ role: payload.role });
      return;
    }
  );
});

router.post("/logout", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is missing" });
    return;
  }

  try {
    await blacklistToken(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logout successful" });
    return;
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Something went wrong during logout" });
    return;
  }
});

export default router;
