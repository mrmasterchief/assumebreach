import express from "express";
import type { Request, Response } from "express";
import pool from "../config/db";
import jwt from "jsonwebtoken";
import { uploadFileMiddleware } from "../controllers/imageUploadController";
import { findUserByEmail, createUser, fetchUserDetails } from "../controllers/userController";
import { randomNameGenerator } from "../functions/randomNameGenerator";
import fs from "fs";
import { RBAC } from "../middleware/rbac";
import { createDummyAcccount, createDummyAdminAccount } from "../data/dummyAccounts";
import { createAccessToken } from "../controllers/ctfController";

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

    const updatedProduct = {
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
    return;

  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});


router.delete("/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "Product deleted" });
    return;

  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});


router.get("/all-users", async (_req: Request, res: Response) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    const usersWithoutPasswords = users.rows.map((user) => {
      const { passwordhash, ...rest } = user;
      return rest;
    });
    res.json(usersWithoutPasswords);
    return;

  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

router.post("/create-ctf-users", async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const users = [];
    for (let i = 0; i < amount; i++) {
      const randomName = randomNameGenerator();
      const formattedName = randomName.replace(/\s+/g, ".").toLowerCase();
      const randomEmail = `${formattedName}@assumebreach.tech`;
      const randomPassword = Math.random().toString(36).substring(2, 15);
      const newUser = await createUser(randomEmail, randomPassword, randomName, true, RBAC.USER);
      users.push({
        email: randomEmail,
        password: randomPassword,
        name: randomName
      });
    }
    const fileContent = users.map(user => `${user.email}:${user.password}`).join("\n");
    const fileName = `users_${Date.now()}.txt`;
    const filePath = `./uploads/${fileName}`;
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }
    fs.writeFileSync(filePath, fileContent);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error downloading file" });
        return;
      }});
    return;
  } catch (error: any) {
    console.error("Error creating users:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

router.delete("/delete-ctf-users", async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM users WHERE email LIKE '%@localhost:4000%' OR email LIKE '%@example.com%'");
    await createDummyAcccount();
    await createDummyAdminAccount();
    const files = fs.readdirSync("./uploads");
    for (const file of files) {
      const filePath = `./uploads/${file}`;
      fs.unlinkSync(filePath);
    }
    res.json({ message: "Users deleted" });
    return;
  } catch (error: any) {
    console.error("Error deleting users:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

router.post("/generate-access-token", async (req: Request, res: Response) => {
  try {
    const response = await createAccessToken();
    if (!response) {
      res.status(500).json({ error: "Failed to create access token" });
      return;
    }
    res.status(200).json({ accessToken: response.accesstoken });
    return;
  } catch (error) {
    console.error("Error generating access token:", error);
    res.status(500).json({ error: "Failed to create access token" });
    return;
  }
});





export default router;