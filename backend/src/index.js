import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { doubleCsrfProtection } from "./middleware/csrf.js";
import errorHandling from "./middleware/errorHandler.js";
import helmetMiddleware from "./middleware/helmet.js";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser(COOKIE_SECRET));
app.use(helmetMiddleware);
app.use(express.json());
app.use(doubleCsrfProtection);

// prefix for all routes


// Error Handling Middleware
app.use(errorHandling);

// Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/api/v1/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});