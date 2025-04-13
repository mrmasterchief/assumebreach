import express from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { fetchUserDetails } from "../controllers/userController";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken";
import { errors } from "../data/errors";
import { User } from "../models/User";

const router = express.Router();

router.get("/details", async (req: Request, res: Response) => {
    const unsafeID = typeof req.query.unsafeID === "string" ? req.query.unsafeID : null;
    const userId = await getUserIdFromToken(req);
    if (!userId || !unsafeID) {
        res.status(401).json({ error: errors[401] });
        return;
    }
    try {
        const userDetails = await fetchUserDetails(userId, unsafeID, false);
        if (!userDetails) {
            res.status(401).json({ error: errors[401] });
            return;
        }
        res.status(200).json({ user: userDetails });
    }
    catch (error) {
        res.status(500).json({ error: errors[500] });
    }
});

router.get("/user", async (req: Request, res: Response) => {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
        res.status(401).json({ error: errors[401] });
        return;
    }
    try {
        const userDetails = await fetchUserDetails(userId, null, false);
        if (!userDetails) {
            res.status(401).json({ error: errors[401] });
            return;
        }
        res.status(200).json({ user: userDetails });
    }
    catch (error) {
        res.status(500).json({ error: errors[500] });
    }
}); 


export default router;