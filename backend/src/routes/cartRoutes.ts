import express from "express";
import type { Request, Response } from "express";
import pool from "../config/db";
import { Product } from "../models/Product";
import jwt from "jsonwebtoken";
import { RBAC } from "../middleware/rbac";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string; role: string };
    const userId = decoded.id;

    const cartIDsResult = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );

    const cartIDs = cartIDsResult.rows.map((row: { id: string }) => row.id);

    if (cartIDs.length > 0) {
      const cartProductsResult = await pool.query(
        `SELECT * FROM cart_items WHERE cart_id = ANY ($1::uuid[])`,
        [cartIDs]
      );

      const cartProducts = cartProductsResult.rows;
        for (let i = 0; i < cartProducts.length; i++) {
            const productID = cartProducts[i].product_id;
            const productResult = await pool.query(
            `SELECT * FROM products WHERE id = $1`,
            [productID]
            );
            const product = productResult.rows[0];
            cartProducts[i].product = product;
        }
        res.json(cartProducts);

    } else {
      res.json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/add", async (req: Request, res: Response) => {
  let { product, quantity } = req.body;
  console.log(req.body);
  console.log(product);
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const productID = product.id;
  if (!productID) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }
  if (!quantity) {
    quantity = 1;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string; role: string };
    const userId = decoded.id;

    const cartResult = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );

    let cartID;
    if (cartResult.rows.length === 0) {
      const newCartResult = await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,
        [userId]
      );
      cartID = newCartResult.rows[0].id;
    } else {
      cartID = cartResult.rows[0].id;
    }

    const cartItemResult = await pool.query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartID, productID]
    );

    if (cartItemResult.rows.length === 0) {
      await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [cartID, productID, quantity]
      );
    } else {
      await pool.query(
        `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3`,
        [quantity, cartID, productID]
      );
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/remove", async (req: Request, res: Response) => {
  let { product } = req.body;
  if(!product) res.status(400).json({ message: "Product is required" });
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const productID = product.id;
  if (!productID) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string; role: string };
    const userId = decoded.id;

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
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
