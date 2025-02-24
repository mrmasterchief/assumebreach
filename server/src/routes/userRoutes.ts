import express from "express";
import type { Request, Response } from "express";
import { fetchUserInformation } from "../controllers/auth";
import { generateTokens, authenticate } from "../middleware/rbac";
import { UserPayload, RBAC } from "../middleware/rbac";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const decoded = authenticate(req, res);
  if (!decoded) {
    return;
  }
  const user = await fetchUserInformation(decoded.id);
  res.json({ message: "Authorized", user });
});

export default router;
