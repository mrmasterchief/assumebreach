import express from "express";
import type { Request, Response } from "express";
import { errors } from "../data/errors";
import { fetchUserDetails, fetchUserDetailsUnrestricted } from "../controllers/userController";
import { flags } from "../data/flags";
import pool from "../config/db";   
import { encryptFlag } from "../helpers/flagcrypto";

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

export default router;
