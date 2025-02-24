import { Request, Response, NextFunction } from 'express';

interface Error {
  statusCode?: number;
  message?: string;
  stack?: string;
}

const errorHandling = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    status: err.statusCode,
    message: "Something went wrong",
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default errorHandling;
