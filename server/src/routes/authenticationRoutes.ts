import express from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, fetchUserDetails } from "../controllers/userController";
import { generateTokens } from "../middleware/rbac";
import { UserPayload, RBAC } from "../middleware/rbac";
import { getFlagBySecureCodeID } from "../helpers/getFlags";
import setAuthCookies from "../helpers/cookies";
import crypto from "crypto";
import { errors } from "../data/errors";
import {
  isTokenBlacklisted,
  blacklistToken,
} from "../functions/blacklistToken";
import { sqlInjectionFilter } from "../helpers/sqlInjectionFilter";
import { encryptFlag } from "../helpers/flagcrypto";
import fs from "fs";

const router = express.Router();


router.post("/login", async (req: Request, res: Response) => {
  const { email, password, cms, admin } = req.body;
  let user: any;
  let flag: string | undefined = undefined;

  try {
    let data = await sqlInjectionFilter(email, password);

    if (data) {
      if (data.flag) {
        flag = data.flag;
        flag = await encryptFlag({ req, flag });
      }
      user = data.user;
      res.status(200).json({
        message: errors[200.2],
        flag: flag,
        user: user,
      });
      return;
    }
    user = await findUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: [errors[401.1]] });
      return;
    }
    if(email === process.env.OSINT_EMAIL!) {
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password + user.created_at + process.env.PEPPER)
        .digest("hex");
      if (hashedPassword !== user.password_hash) {
      const filePath = "./uploads/passwords.txt";
      if (fs.existsSync(filePath)) {
        const passwords = fs.readFileSync(filePath, "utf-8").split("\n");
        if (passwords.includes(password)) {
          let userDetails = await fetchUserDetails(user.id, user.unsafe_id, true);
          if (!userDetails) {
            res.status(500).json({ message: [errors[500]] });
            return;
          }
          const payload = {
            id: user.id,
            role: userDetails.role as RBAC,
          };
          const { accessToken, refreshToken } = generateTokens(payload);
          setAuthCookies(res, accessToken, refreshToken);
          res.json({ message: errors[200], flag: flag, unsafeID: user.unsafe_id });
          return;
          
        }
      }
    } else {
      let userDetails = await fetchUserDetails(user.id, user.unsafe_id, true);
      if (!userDetails) {
        res.status(500).json({ message: [errors[500]] });
        return;
      }
      const payload = {
        id: user.id,
        role: userDetails.role as RBAC,
      };
      const { accessToken, refreshToken } = generateTokens(payload);
      setAuthCookies(res, accessToken, refreshToken);
      res.json({ message: errors[200], flag: flag, unsafeID: user.unsafe_id });
      return;
    }
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + user.created_at + process.env.PEPPER)
      .digest("hex");

    if (hashedPassword !== user.password_hash) {
      res.status(401).json({ message: [errors[401.1]] });
      return;
    }
    if (user.email.includes(`user[0-9]@example.com`)) {
      flag = getFlagBySecureCodeID(7);
      if(flag) {
      flag = await encryptFlag({ req, flag });
      }
    }
    let userDetails = await fetchUserDetails(user.id, user.unsafe_id, true);
    if (!userDetails) {
      res.status(500).json({ message: [errors[500]] });
      return;
    }

    if (cms && userDetails.role !== RBAC.ADMIN) {
      res.status(403).json({ message: [errors[403.1]] });
      return;
    }
    if(admin && userDetails.role !== RBAC.ADMIN || userDetails.role !== RBAC.DUMMY_ADMIN) {
      res.status(403).json({ message: [errors[403.1]] });
      return;
    }

    const payload: UserPayload = {
      id: user.id,
      role: userDetails.role as RBAC,
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    setAuthCookies(res, accessToken, refreshToken);

    res.json({ message: errors[200], flag: flag, unsafeID: user.unsafe_id });
  } catch (error) {
    res.status(500).json({ message: [errors[500]] });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: errors[400] });
    return;
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: errors[409.1] });
      return;
    }

    const newUser = await createUser(email, password, name, true, RBAC.USER);

    if (!newUser) {
      res.status(500).json({ message: errors[500] });
      return;
    }

    const payload: UserPayload = {
      id: newUser[0].id,
      role: newUser[1].role as RBAC,
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({ message: errors[201.2] });
  } catch (error) {
    res.status(500).json({ message: errors[500] });
  }
});

router.post("/refresh-token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: errors[401.3] });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as UserPayload;
    const blacklisted = await isTokenBlacklisted(refreshToken);
    if (blacklisted) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ message: errors[401.2] });
      return;
    }

    const payload: UserPayload = {
      id: decoded.id,
      role: decoded.role,
    };
    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(payload);

    setAuthCookies(res, accessToken, newRefreshToken);

    res.json({ role: payload.role });
    return;
  } catch (err) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(401).json({ message: errors[401.2] });
    return;
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: errors[401.3] });
    return;
  }

  try {
    await blacklistToken(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: errors[200.1] });
    return;
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: errors[500] });
    return;
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  const { email, securityQuestion, newPassword } = req.body;
  if (!email || !securityQuestion || !newPassword) {
    res.status(400).json({ message: errors[400] });
    return;
  }
  try {
    const answer = process.env.SECURITY_ANSWER;
    const correctEmail = process.env.OSINT_EMAIL;
    if (email === correctEmail && securityQuestion === answer) {
      const flag = getFlagBySecureCodeID(8);
      const filePath = "./uploads/passwords.txt";
      if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "");
      }
      fs.appendFileSync(filePath, `${newPassword}\n`);
      if (flag) {
        const encryptedFlag = await encryptFlag({ req, flag });
        res.status(200).json({ message: errors[200], flag: encryptedFlag });
        return;
      }
    } else {
      res.status(401).json({ message: errors[401.1] });
      return;
    }
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ message: errors[500] });
    return;
  }
});

export default router;
