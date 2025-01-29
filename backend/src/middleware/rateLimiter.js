import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10000, // Change this to a lower value when pushing to production
  message: "Too many requests from this IP, please try again after an hour",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export default rateLimiter;
