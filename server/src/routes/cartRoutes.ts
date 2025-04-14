import express from "express";
import type { Request, Response } from "express";
import {getUserIdFromToken} from "../helpers/getUserIdFromToken";
import { getCartItems, addCartItem, removeCartItem, clearCart, updateCartItemQuantity } from "../controllers/cartController";
import { errors } from "../data/errors";


const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    res.status(401).json({ message: errors[401] });
    return;
  }

  try {
    const cartProducts = await getCartItems(userId);
    res.json(cartProducts);
    return;
  } catch (error) {
    res.status(500).json({ message: errors[500] });
    return;
  }
});

router.post("/add", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    res.status(401).json({ message: errors[401] });
    return;
  }

  let { product, quantity } = req.body;
  const productID = product?.id;

  if (!productID) {
    res.status(400).json({ message: errors[400] });
    return;
  }

  quantity = quantity || 1;

  try {
    await addCartItem(userId, productID, quantity);
    res.status(200).json({ message: errors[200] });
    return;
  } catch (error) {
    res.status(500).json({ message: errors[500] });
    return;
  }
});

router.post("/remove", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    res.status(401).json({ message: errors[401] });
    return;
  }

  const { product } = req.body;
  const productID = product?.id;

  if (!productID) {
    res.status(400).json({ message: errors[400] });
    return;
  }

  try {
    await removeCartItem(userId, productID);
    res.status(200).json({ message: errors[200] });
    return;
  } catch (error) {
    res.status(500).json({ message: errors[500] });
    return;
  }
});

router.post("/new-quantity", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ message: errors[401] });
    return;
  }
  const { product, quantity } = req.body;
  const productID = product?.id;
  if (!productID) {
    res.status(400).json({ message: errors[400] });
    return;
  }
  if (!quantity) {
    res.status(400).json({ message: errors[400] });
    return;
  }
  try {
    await updateCartItemQuantity(userId, productID, quantity);
    res.status(200).json({ message: errors[200] });
    return;
  } catch (error) {
    res.status(500).json({ message: errors[500] });
    return;
  }
});

export default router;
