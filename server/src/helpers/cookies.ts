import { Response } from "express";
import jwt from "jsonwebtoken";
import { Request } from "express";

export default function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
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
  const existingFlags = await getFlagsFromToken(req)
  const newFlags = { ...existingFlags, ...flags };
  const flagsCookie = jwt.sign(
    { flags: newFlags },
    process.env.FLAGS_COOKIE_SECRET!,
    { expiresIn: "1h" }
  );
  return flagsCookie;
}

