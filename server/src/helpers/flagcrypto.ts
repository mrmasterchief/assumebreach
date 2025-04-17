import { Request } from "express";
import crypto from "crypto";


export const encryptFlag = async (
    { req, flag }: { req: Request; flag: string }
): Promise<string> => {
    const cookie = req.cookies["--anon-ctf-unique-identifier"];
    if (!cookie) {
        throw new Error("Cookie not found");
    }
    try{
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
      throw new Error("Cookie not found");
    }
  
    try {
        console.log("Decrypting flag:", flag);
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(process.env.FLAG_ENCRYPTION_KEY!, "hex"),
        Buffer.from(process.env.FLAG_ENCRYPTION_IV!, "hex")
      );
  
      let decrypted = decipher.update(flag, "hex", "utf8");
      decrypted += decipher.final("utf8");
  
      const parsed = JSON.parse(decrypted);
  
      if (parsed.cookie !== cookie) {
        throw new Error("Invalid cookie for this flag");
      }
  
      return parsed.flag;
    } catch (error) {
      console.error("Error decrypting flag:", error);
      throw new Error("Error decrypting flag");
    }
  };
  