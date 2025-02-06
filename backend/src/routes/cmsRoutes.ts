import express from "express";
import type { Request, Response } from "express";
import pool from "../config/db";
import { Product } from "../models/Product";
import { uploadFileMiddleware } from "../controllers/imageUpload";
const router = express.Router();

router.post("/product", uploadFileMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      title,
      categories,
      description,
      price,
      discountPrice,
      active,
      options,
      quantity,
      information,
    } = req.body;

    const imagePath = `/products/${req?.file?.originalname}`;
    
    const parsedCategories = typeof categories === "string" ? JSON.parse(categories) : categories;

    const numericPrice = parseFloat(price);
    const numericDiscountPrice = discountPrice === "" ? null : parseFloat(discountPrice);
    
    const newProduct = {
      title,
      categories: parsedCategories,
      description,
      price: numericPrice,
      discountPrice: numericDiscountPrice,
      imagePath,
      active: active ?? true,
      options,
      quantity: quantity ?? 0,
      information: typeof information === "string" ? JSON.parse(information) : information,
    };

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const product = await pool.query(
      `INSERT INTO products 
       (title, categories, description, price, discountPrice, imagePath, active, options, quantity, material, country_of_origin, type, weight, dimensions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        newProduct.title,
        newProduct.categories,
        newProduct.description,
        newProduct.price,
        newProduct.discountPrice,
        newProduct.imagePath,
        newProduct.active,
        newProduct.options,
        newProduct.quantity,
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

router.get("/all-products/:page", async (_req: Request, res: Response) => {
  const { page } = _req.params;
  const limit = 10;
  const offset = (parseInt(page) - 1) * limit;
  try {
    const products = await pool.query(
      "SELECT * FROM products ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, offset]
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
      quantity,
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
      quantity: quantity ?? 0,
      information,
    };
    const product = await pool.query(
      "UPDATE products SET title = $1, categories = $2, description = $3, price = $4, discountPrice = $5, imagePath = $6, active = $7, options = $8, material = $9, country_of_origin = $10, type = $11, weight = $12, dimensions = $13, quantity = $14 WHERE id = $15 RETURNING *",
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
        updatedProduct.quantity,
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

router.get("/all-users", async (_req: Request, res: Response) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(
      users.rows.map((user) => {
        const { passwordhash, ...rest } = user;
        return rest;
      })
    );
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

export default router;
