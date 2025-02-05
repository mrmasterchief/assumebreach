import express from "express";
import type { Request, Response } from "express";
import pool from "../config/db";
import { Product } from "../models/Product";

const router = express.Router();

router.post("/product", async (req: Request, res: Response) => {
  try {
    const {
      title,
      categories,
      description,
      price,
      discountPrice,
      imagePath,
      active,
      options,
      information,
    } = req.body;
    const newProduct: Product = {
      title,
      categories,
      description,
      price,
      discountPrice,
      imagePath,
      active,
      options,
      information,
    };
    let priceString = req.body.price;

    if (typeof priceString === "number") {
      priceString = priceString.toString();
    }

    if (typeof priceString !== "string") {
      res.status(400).json({ error: "Invalid price format" });
      return;
    }
    const product = await pool.query(
      "INSERT INTO products (title, categories, description, price, discountPrice, imagePath, active, options, material, country_of_origin, type, weight, dimensions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        newProduct.title,
        newProduct.categories,
        newProduct.description,
        newProduct.price,
        newProduct.discountPrice,
        newProduct.imagePath,
        newProduct.active,
        newProduct.options,
        newProduct.information.material,
        newProduct.information.countryOfOrigin,
        newProduct.information.type,
        newProduct.information.weight,
        newProduct.information.dimensions,
      ]
    );
    res.json(product.rows[0]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.get("/all-products", async (_req: Request, res: Response) => {
    try {
      const products = await pool.query("SELECT * FROM products");
      res.json(products.rows);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
        return;
      }
    }
    return;
});

router.put("/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      categories,
      description,
      price,
      discountPrice,
      imagePath,
      active,
      options,
      information,
    } = req.body;
    const updatedProduct: Product = {
      title,
      categories,
      description,
      price,
      discountPrice,
      imagePath,
      active,
      options,
      information,
    };
    const product = await pool.query(
      "UPDATE products SET title = $1, categories = $2, description = $3, price = $4, discountPrice = $5, imagePath = $6, active = $7, options = $8, material = $9, country_of_origin = $10, type = $11, weight = $12, dimensions = $13 WHERE id = $14 RETURNING *",
      [
        updatedProduct.title,
        updatedProduct.categories,
        updatedProduct.description,
        updatedProduct.price,
        updatedProduct.discountPrice,
        updatedProduct.imagePath,
        updatedProduct.active,
        updatedProduct.options,
        updatedProduct.information.material,
        updatedProduct.information.countryOfOrigin,
        updatedProduct.information.type,
        updatedProduct.information.weight,
        updatedProduct.information.dimensions,
        id,
      ]
    );
    res.json(product.rows[0]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
      return;
    }
  }
});



router.delete("/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "Product deleted" });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;