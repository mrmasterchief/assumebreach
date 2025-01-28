import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import pool from "./config/db.js";
import cookieParser from "cookie-parser";
import {
  doubleCsrfProtection,
  generateToken,
  csrfErrorHandler,
} from "./middleware/csrf.js";
import errorHandling from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "cookie_secret";

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser(COOKIE_SECRET));
app.use(helmet());
app.use(doubleCsrfProtection);

// Error Handling Middleware
app.use(errorHandling);

// Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
