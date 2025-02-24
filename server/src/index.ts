import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { csrfProtection } from "./middleware/csrf.js";
import errorHandling from "./middleware/errorHandler.js";
import helmetMiddleware from "./middleware/helmet.js";
import { authorize, RBAC } from "./middleware/rbac.js";

import productRoutes from "./routes/productRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authenticationRoutes from "./routes/authenticationRoutes.js";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser(COOKIE_SECRET));
app.use(helmetMiddleware);
app.use(express.json());
app.use(csrfProtection);

// API Routes with authorization
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authenticationRoutes);
app.use(
  "/api/v1/cart",
  authorize([RBAC.MODERATOR, RBAC.ADMIN, RBAC.USER]),
  cartRoutes
);
app.use("/api/v1/cms", authorize([RBAC.MODERATOR, RBAC.ADMIN]), cmsRoutes);
app.use(
  "/api/v1/user",
  authorize([RBAC.MODERATOR, RBAC.ADMIN, RBAC.USER]),
  userRoutes
);
// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, "public")));

// CSRF token endpoint
app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Health check endpoint (potentially insecure for CTF purposes)
app.get("/api/v1/health", (_req, res) => {
  res.json({
    endpoints: [
      "/api/v1/products",
      "/api/v1/products/:page",
      "/api/v1/products/category/:category",
      "/api/v1/products/search/:query",
      "/api/v1/products/:id",
      "/api/v1/cms",
      "/api/v1/cms/:id",
      "/api/v1/csrf-token",
      "CTF{3ndp0int5_4r3_c00l}", // Example CTF flag
    ],
    "All endpoints are healthy and up": true,
  });
});

// Error Handling Middleware - Placed after all other routes
app.use(errorHandling);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
