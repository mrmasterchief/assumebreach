import express from "express";
import type { Request, Response } from "express";
import { errors } from "../data/errors";
import { fetchUserDetails, fetchUserDetailsUnrestricted } from "../controllers/userController";
import { flags } from "../data/flags";
import pool from "../config/db";   
import { encryptFlag } from "../helpers/flagcrypto";
import { uploadFileMiddleware } from "../controllers/imageUploadController";

const router = express.Router();

router.get("/all-products/:page", async (req: Request, res: Response) => {
    const { page } = req.params;
    const limit = 5;
    const offset = (parseInt(page) - 1) * limit;
  
    try {
      const products = await pool.query(
        "SELECT * FROM products ORDER BY id DESC LIMIT $1 OFFSET $2",
        [limit, offset]
      );
  
      const totalProductsResult = await pool.query("SELECT COUNT(*) FROM products");
      const totalProducts = parseInt(totalProductsResult.rows[0].count, 10);
  
      res.json({ products: products.rows, totalProducts });
      return;
  
    } catch (error: any) {
      console.error("Error getting products:", error);
      res.status(500).json({ error: error.message });
      return;
    }
});

router.get("/all-users/:page", async (req: Request, res: Response) => {
    const { page } = req.params;
    const limit = 5;
    const offset = (parseInt(page) - 1) * limit;
    try {
        const users = await pool.query(
            "SELECT * FROM users ORDER BY id DESC LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        const filteredUsers = users.rows.filter((user: any) => {
            return !user.email.includes(process.env.ADMIN_EMAIL!) && !user.email.includes("@assumebreach.tech");
        });
        const totalUsersResult = await pool.query("SELECT COUNT(*) FROM users");
        const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);
        const filteredUsersCount = filteredUsers.length;
        const totalFilteredUsers = filteredUsersCount > 0 ? filteredUsersCount : 0;

        let flag = flags.find((flag) => flag.secureCodeID === 3)?.flag;
        if(flag) {
            flag = await encryptFlag({req, flag});
        }
        res.json({ users: filteredUsers, totalFilteredUsers, flag });
        return;
    } catch (error: any) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: error.message });
        return;
    }
});

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
  
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
  
      const imagePath = `/products/${req.file.originalname}`;
  
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
      return;
  
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: error.message });
      return;
    }
  });

export default router;
