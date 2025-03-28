import express from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  isTokenBlacklisted,
  blacklistToken,
} from "../controllers/auth";
import { generateTokens } from "../middleware/rbac";
import { UserPayload, RBAC } from "../middleware/rbac";
import { createAdminAccount, createDummyAcccount } from "../data/dummyAccounts";
import setAuthCookies from "../helpers/setAuthCookies";
import crypto from "crypto";
import { simulateSQLInjection } from "../controllers/vulnerabilityFilter";
import { sqlInjectionStatements } from "../data/sqlInjectionStatements";
import { errors } from "../data/errors";
import { flags } from "../data/flags";

const router = express.Router();

createAdminAccount();
createDummyAcccount();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password, cms } = req.body;

  try {
    let user: any;
    let flag: string | undefined = undefined;
    console.log(password)

    const isDisallowedSQL =
    sqlInjectionStatements.disallowedSQLInjectionStatements.some(
      (keyword) => email.toUpperCase().includes(keyword) || password.toUpperCase().includes(keyword)
    );

    if (isDisallowedSQL) {
      res.status(401).json({ message: errors[403.2] });
      return;
    }

    const isAllowedSQL =
    sqlInjectionStatements.allowedSQLInjectionStatements.some(
      (keyword) => email.toUpperCase().includes(keyword) || password.toUpperCase().includes(keyword)
    );

    if (isAllowedSQL) {
      if (email.includes("FROM") || password.includes("FROM"))
        if (email.includes("FROM users") || password.includes("FROM users")) {
          user = await simulateSQLInjection(email, password);
          flag = flags.find((flag) => flag.secureCodeID === 4)?.flag;
        } else {
          res.status(403).json({ message: errors[403.2] });
        }
      else {
        user = await simulateSQLInjection(email, password);
        flag = flags.find((flag) => flag.secureCodeID === 4)?.flag;
      }

      if (user.length > 1) {
        // simulating a SQL injection attack by returning multiple users
        res.status(200).json({
          error: user,
          flag: flag
        });
        return;
      }

      if (user.length === 0) {
        res.status(401).json({ message: [errors[401.1]] });
        return;
      }
    } else {
       user = await findUserByEmail(email);

      if (!user) {
        res.status(401).json({ message: [errors[401.1]] });
        return;
      }

      const hashedPassword = crypto
        .createHash("sha256")
        .update(password + user.created_at + process.env.PEPPER)
        .digest("hex");

      if (hashedPassword !== user.password_hash) {
        res.status(401).json({ message: [errors[401.1]] });
        return;
      }

      if (cms && user.role !== RBAC.ADMIN) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
    }

    const payload: UserPayload = {
      id: user.id,
      role: user.role as RBAC,
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    setAuthCookies(res, accessToken, refreshToken);

    res.json({ message: "Login successful", flag: flag });
  } catch (error) {
    res.status(500).json({ message: [errors[500]] });
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
