import express from "express";
import type { Request, Response } from "express";
import { errors } from "../data/errors";
import {
  fetchProductById,
  fetchProductsByPage,
  fetchProductsByCategory,
  searchProducts,
} from "../controllers/productController";

const router = express.Router();

router.get(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const productDetails = await fetchProductById(id);

      res.status(200).json(productDetails);
    } catch (error) {
      res.status(500).json({ error: errors[500] });
    }
  }
);

router.get("/page/:page", async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const products = await fetchProductsByPage(parseInt(page, 10));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: errors[500] });
  }
});

router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await fetchProductsByCategory(category);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: errors[500] });
  }
});

router.get("/search/:query", async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const products = await searchProducts(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: errors[500] });
  }
});

export default router;
