import express from "express";
import type { Request, Response } from "express";
import { errors } from "../data/errors";
import { fetchUserDetails } from "../controllers/userController";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken";
import { flags } from "../data/flags";
import { Flag } from "../models/Flag";

const router = express.Router();

router.post("/flags", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);
  const unsafeId = req.body.unsafeID || null;
  if (!userId || !unsafeId) {
    res.status(401).json({ error: errors[401] });
    return;
  }
  try {
    const userDetails = await fetchUserDetails(userId, unsafeId);

    if (!userDetails) {
      res.status(401).json({ error: errors[401] });
      return;
    }
    let flagsList = flags.map(({ flag, ...rest }: Flag) => {
      const collected = userDetails.collected_flags.includes(flag);
      return {
        ...rest,
        collected,
      };
    });

    res.status(200).json({ flags: flagsList, score: userDetails.score });
    return;
  } catch (error) {
    res.status(500).json({ error: errors[500] });
  }
});

export default router;
