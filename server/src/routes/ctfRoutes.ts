import express from "express";
import type { Request, Response } from "express";
import { errors } from "../data/errors";
import { fetchUserDetails, fetchUserDetailsUnrestricted } from "../controllers/userController";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken";
import { flags } from "../data/flags";
import { Flag } from "../models/Flag";
import { addFlagAndScoreToUser } from "../controllers/ctfController";
import { secureCode } from "../data/secureCode";
import { decryptFlag, encryptFlag } from "../helpers/flagcrypto";

const router = express.Router();

router.post("/flags", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);
  const unsafeId = req.body.unsafeID || null;
  if (!userId || !unsafeId) {
    res.status(401).json({ error: errors[401] });
    return;
  }

  try {
    const userDetails = await fetchUserDetailsUnrestricted(userId, unsafeId);

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

router.post("/flag", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);
  const unsafeId = req.body.unsafeID || null;
  if (!userId || !unsafeId) {
    res.status(401).json({ error: errors[401] });
    return;
  }
  const flag = req.body.flag;
  if (!flag) {
    res.status(400).json({ error: errors[400] });
    return;
  }
  const decryptedFlag = await decryptFlag({ req, flag });
  try {
    const userDetails = await fetchUserDetailsUnrestricted(userId, unsafeId);
    if (!userDetails) {
      res.status(401).json({ error: errors[401] });
      return;
    }
    const collected = userDetails.collected_flags.includes(decryptedFlag);
    if (collected) {
      res.status(400).json({ error: errors[400] });
      return;
    }
    const flagDetails = flags.find((f) => f.flag === decryptedFlag);
    if (!flagDetails) {
      res.status(400).json({ error: errors[400] });
      return;
    }
    const score = flagDetails.difficulty === "Easy" ? 10 : flagDetails.difficulty === "Medium" ? 20 : 30;
    const updatedUserDetails = await addFlagAndScoreToUser(
      userId,
      unsafeId,
      flag,
      score
    );
    if (!updatedUserDetails) {
      res.status(500).json({ error: errors[500] });
      return;
    }
    res.status(200).json({
      message: "Flag added successfully",
      flag: flagDetails.flag,
    });
  } catch (error) {
    res.status(500).json({ error: errors[500] });
  }
});

router.post("/securecode", async (req: Request, res: Response) => {
  const secureCodeID = req.body.secureCodeID;
  if (!secureCodeID) {
    res.status(400).json({ error: errors[400] });
    return;
  }
  try {
    secureCode.find((code) => {
      if (code.id === secureCodeID) {
        res.status(200).json({
          secureCode: code,
        });
        return;
      }
    });
   return;
  } catch (error) {
    res.status(500).json({ error: errors[500] });
    return;
  }
});


export default router;
