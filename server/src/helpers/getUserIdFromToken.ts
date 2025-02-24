import { Request } from "express";
import jwt from "jsonwebtoken";

export default async function getUserIdFromToken(
  req: Request
): Promise<string | null> {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string; role: string };
    return decoded.id;
  } catch (err) {
    console.error("Error verifying token:", err);
    return null;
  }
}
