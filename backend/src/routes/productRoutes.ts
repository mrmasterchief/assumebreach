import express from "express";
import type { Request, Response, } from "express";
import pool from "../config/db";
import { Product } from "../models/Product";
import crypto from "crypto";

const router = express.Router();


router.post("/", async (req: Request, res: Response) => {
    try {
        const { title, category, description, price, image, options, information } = req.body;
        const newProduct: Product = {
        id: crypto.randomBytes(16).toString("hex"),
        title,
        category,
        description,
        price,
        image,
        options,
        information,
        };
        let priceString = req.body.price;
        console.log(req.body);

        if (typeof priceString === 'number') {
            priceString = priceString.toString();
        }
    
        if (typeof priceString !== 'string') {
             res.status(400).json({ error: 'Invalid price format' });
             return
        }
        const product = await pool.query(
        "INSERT INTO products (title, category, description, price, image, options, material, country_of_origin, type, weight, dimensions, uniqueIdentifier) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        [newProduct.title, newProduct.category, newProduct.description, newProduct.price, newProduct.image, newProduct.options, newProduct.information.material, newProduct.information.countryOfOrigin, newProduct.information.type, newProduct.information.weight, newProduct.information.dimensions, newProduct.id]
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

router.get("/", async (_req: Request, res: Response) => {
    try {
        const products = await pool.query("SELECT * FROM products");
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
        const product = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        res.json(product.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, category, description, price, image, options, information } = req.body;
        const updatedProduct = await pool.query(
        "UPDATE products SET title = $1, category = $2, description = $3, price = $4, image = $5, options = $6, information = $7 WHERE id = $8 RETURNING *",
        [title, category, description, price, image, options, information, id]
        );
        res.json(updatedProduct.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.json({ message: "Product deleted" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

export default router;

