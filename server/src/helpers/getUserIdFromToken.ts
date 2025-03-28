import { Request } from "express";
import jwt from "jsonwebtoken";

export async function getUserIdFromToken(
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


export async function getFlagsFromToken(
  req: Request
): Promise<{ [key: string]: boolean } | null> {
  const flagsCookie = req.cookies.flags;

  if (!flagsCookie) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      flagsCookie,
      process.env.FLAGS_COOKIE_SECRET!
    ) as { flags: { [key: string]: boolean } };
    return decoded.flags;
  } catch (err) {
    console.error("Error verifying token:", err);
    return null;
  }
}

export async function createFlagsCookie(
  flags: { [key: string]: boolean },
  req: Request
): Promise<string> {
  const existingFlags = await getFlagsFromToken(req);
  const newFlags = { ...existingFlags, ...flags };
  const flagsCookie = jwt.sign(
    { flags: newFlags },
    process.env.FLAGS_COOKIE_SECRET!,
    { expiresIn: "1h" }
  );
  return flagsCookie;
}

