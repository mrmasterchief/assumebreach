import express from "express";
import type { Request, Response } from "express";
import pool from "../config/db";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken";

interface CartProduct {
  product_id: string;
  quantity: number;
  product?: any;
}

const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const cartIDsResult = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );
    const cartIDs = cartIDsResult.rows.map((row: { id: string }) => row.id);

    if (cartIDs.length === 0) {
      res.json([]);
      return;
    }

    const cartProductsResult = await pool.query(
      `SELECT * FROM cart_items WHERE cart_id = ANY ($1::uuid[])`,
      [cartIDs]
    );

    const cartProducts: CartProduct[] = cartProductsResult.rows;

    const productIds = cartProducts.map((item) => item.product_id);
    const productsResult = await pool.query(
      `SELECT * FROM products WHERE id = ANY ($1::uuid[])`,
      [productIds]
    );
    const products = productsResult.rows.reduce((acc: any, product: any) => {
      acc[product.id] = product;
      return acc;
    }, {});

    cartProducts.forEach((item) => {
      item.product = products[item.product_id];
    });

    res.json(cartProducts);
    return;
  } catch (err) {
    console.error("Error getting cart:", err);
    res.status(500).send("Server error");
    return;
  }
});

router.post("/add", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  let { product, quantity } = req.body;
  const productID = product?.id;

  if (!productID) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }

  quantity = quantity || 1;

  try {
    const cartResult = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );
    const cartID =
      cartResult.rows.length > 0
        ? cartResult.rows[0].id
        : (
            await pool.query(
              `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,
              [userId]
            )
          ).rows[0].id;

    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + $3`,
      [cartID, productID, quantity]
    );

    res.json({ message: "Added to cart" });
    return;
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Server error");
    return;
  }
});

router.post("/remove", async (req: Request, res: Response) => {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { product } = req.body;
  const productID = product?.id;

  if (!productID) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }

  try {
    const cartResult = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );
    if (cartResult.rows.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const cartID = cartResult.rows[0].id;

    await pool.query(
      `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartID, productID]
    );

    res.json({ message: "Removed from cart" });
    return;
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).send("Server error");
    return;
  }
});

export default router;
