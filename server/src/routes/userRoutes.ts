import express from "express";
import type { Request, Response } from "express";
import { fetchUserDetails, findUserById, updateUserDetails, postReview } from "../controllers/userController";
import { placeOrder } from "../controllers/cartController";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken";
import { errors } from "../data/errors";
import { User } from "../models/User";
import { flags } from "../data/flags";
import { encryptFlag } from "../helpers/flagcrypto";
import marked from "marked";

const router = express.Router();


marked.setOptions({
    sanitize: true,
    mangle: false,
});


router.get("/details", async (req: Request, res: Response) => {
    const unsafeID = typeof req.query.unsafeID === "string" ? req.query.unsafeID : null;
    const userId = await getUserIdFromToken(req);
    if (!userId || !unsafeID) {
        res.status(401).json({ error: errors[401] });
        return;
    }
    try {
        const userDetails = await fetchUserDetails(userId, unsafeID, false);
        const user = await findUserById(userId);
        if (!user || !userDetails) {
            res.status(401).json({ error: errors[401] });
            return;
        }
        res.status(200).json({ user: userDetails, userId: user.id, email: user.email });

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

router.post("/update", async (req: Request, res: Response) => {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
        res.status(401).json({ error: errors[401] });
        return;
    }
    const { full_name, email, password, phone, birth_date, address } = req.body;
    try {
        const userDetails = await fetchUserDetails(userId, null, true);
        if (!userDetails) {
            res.status(401).json({ error: errors[401] });
            return;
        }
        const updatedFields = {
            ...(full_name && { full_name }),
            ...(phone && { phone }),
            ...(birth_date && { birth_date }),
            ...(address && { address })
        }; 
        const updatedUser = await updateUserDetails(userId, null, { ...updatedFields });
        if (!updatedUser) {
            res.status(401).json({ error: errors[401] });
            return;
        }
        res.status(200).json({ message: errors[200], user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: errors[500] });
    }
}
);

router.post("/place-order", async (req: Request, res: Response) => {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
        res.status(401).json({ error: errors[401] });
        return;
    }
    const { orderObject } = req.body;
    if (!orderObject) {
        res.status(400).json({ error: errors[400] });
        return;
    }
    try {
        const orderDetails = await placeOrder(userId, orderObject);
        res.status(200).json({ message: errors[200] });
    }
    catch (error) {
        res.status(500).json({ error: errors[500] });
    }
});

router.post("/post-review", async (req: Request, res: Response) => {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
        res.status(401).json({ error: errors[401] });
        return;
    }
    const { review } = req.body;
    if (!review) {
        res.status(400).json({ error: errors[400] });
        return;
    }
    let html = marked(review);
    if (html.includes("alert")) {
        let flag = flags.find((flag) => flag.secureCodeID === 14)?.flag;
        if (flag) {
            flag = await encryptFlag({req, flag});
            html = html.replace(/alert\((.*?)\)/g, `alert('${flag}')`);
        }
    }
    try {
        const reviewDetails = await postReview(userId,review, html);
        res.status(200).json({ message: errors[200] });
    }
    catch (error) {
        res.status(500).json({ error: errors[500] });
    }
}); 



export default router;