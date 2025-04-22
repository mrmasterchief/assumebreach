import express from "express";
import type { Request, Response } from "express";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken";
import { getCartItems, addCartItem, removeCartItem, updateCartItemQuantity, fetchOrders, fetchOrderDetails } from "../controllers/cartController";
import { errors } from "../data/errors";
import { findUserByUnsafeId } from "../controllers/userController";
import { flags } from "../data/flags";
import { encryptFlag } from "../helpers/flagcrypto";


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

  let { product, quantity, variant } = req.body;
  const productID = product?.id;

  if (!productID) {
    res.status(400).json({ message: errors[400] });
    return;
  }

  quantity = quantity || 1;

  try {
    await addCartItem(userId, productID, quantity, variant);
    res.status(200).json({ message: errors[200] });
    return;
  } catch (error) {
    res.status(500).json({ message: errors[500] });
    return;
  }
});

router.post("/remove", async (req: Request, res: Response) => {
  let flag;
  const realUserId = await getUserIdFromToken(req);
  const { productID, unsafeID } = req.body;
  const user = await findUserByUnsafeId(unsafeID);
  if (!user) {
    res.status(401).json({ message: errors[401] });
    return;
  }
  const userId = user?.id;

  if (realUserId !== userId) {
    flag = flags.find((flag) => flag.secureCodeID === 11)?.flag;
    if (flag) {
      flag = await encryptFlag({ req, flag });
    }
  }


  if (!productID) {
    res.status(400).json({ message: errors[400] });
    return;
  }

  try {
    await removeCartItem(userId, productID);
    res.status(200).json({ message: errors[200], flag: flag });
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

router.get("/orders", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ message: errors[401] });
    return;
  }
  try {
    const orders = await fetchOrders(userId);
    res.status(200).json({ orders });
    return;
  } catch (error) {
    res.status(500).json({ message: errors[500] });
    return;
  }
});

router.post("/orders", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ message: errors[401] });
    return;
  }
  const { orderID } = req.body;
  if (!orderID) {
    res.status(400).json({ message: errors[400] });
    return;
  }
  try {
    const orderDetails = await fetchOrderDetails(req, orderID, userId);
    if (!orderDetails) {
      res.status(404).json({ message: errors[404] });
      return;
    }

    res.status(200).json({ orderDetails });
    return;
  } catch (error) {
    res.status(500).json({ message: errors[500] });
    return;
  }
});

export default router;
