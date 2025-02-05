import express from "express";
import type { Request, Response } from "express";
import pool from "../config/db";
import { Product } from "../models/Product";
import crypto from "crypto";

const router = express.Router();


router.get("/:page", async (_req: Request, res: Response) => {
  try {
    const { page } = _req.params;
    const products = await pool.query(
      "SELECT * FROM products ORDER BY id OFFSET $1 LIMIT 12",
      [page]
    );
    res.json(products.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});


router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await pool.query(
      "SELECT * FROM products WHERE $1 = ANY(categories)",
      [category]
    );
    res.json(products.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.get("/search/:query", async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const products = await pool.query(
      "SELECT * FROM products WHERE description ILIKE $1",
      [`%${query}%`]
    );
    res.json(products.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    res.json(product.rows[0]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});


export default router;
