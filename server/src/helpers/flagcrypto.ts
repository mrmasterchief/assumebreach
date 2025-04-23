import { Request } from "express";
import crypto from "crypto";


export const encryptFlag = async (
  { req, flag }: { req: Request; flag: string }
): Promise<string> => {
  const cookie = req.cookies["--anon-ctf-unique-identifier"];
  if (!cookie) {
    throw new Error("Cookie not found");
  }
  try {
    const payload = {
      flag: flag,
      cookie: cookie,
    };
    // create a decryptable flag with the cookie and the flag
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(process.env.FLAG_ENCRYPTION_KEY!, "hex"),
      Buffer.from(process.env.FLAG_ENCRYPTION_IV!, "hex")
    );
    let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }
  catch (error) {
    console.error("Error hashing flag:", error);
    throw new Error("Error hashing flag");
  }
};


export const decryptFlag = async (
  { req, flag }: { req: Request; flag: string }
): Promise<string> => {
  const cookie = req.cookies["--anon-ctf-unique-identifier"];
  if (!cookie) {
    return "Missing cookie";
  }

  try {
    const key = Buffer.from(process.env.FLAG_ENCRYPTION_KEY!, "hex");
    const iv = Buffer.from(process.env.FLAG_ENCRYPTION_IV!, "hex");

    // Basic validation
    if (!flag || typeof flag !== "string" || !/^[0-9a-fA-F]+$/.test(flag)) {
      return "Invalid flag format";
    }

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    let decrypted = decipher.update(flag, "hex", "utf8");
    decrypted += decipher.final("utf8");

    let parsed: { flag?: string; cookie?: string } = {};
    try {
      parsed = JSON.parse(decrypted);
    } catch {
      return "Malformed decrypted payload";
    }

    if (parsed.cookie !== cookie) {
      return "Cookie mismatch";
    }

    return parsed.flag || "No flag found in payload";

  } catch (error) {
    console.error("Decryption error:", error);
    return "Error decrypting flag";
  }
};

