import { Models } from "../models/Models";
import crypto from "crypto";
import { createUserInDB, createUserDetailsInDB } from "../functions/create";
import withTransaction from "../functions/withTransaction";

function hashPassword(password: string, createdAt: Date, secureMethod: boolean): string {
  if (!process.env.PEPPER) {
    throw new Error("PEPPER environment variable is not set.");
  }
  return secureMethod
    ? crypto
        .createHash("sha256")
        .update(password + createdAt + process.env.PEPPER)
        .digest("hex")
    : crypto.createHash("md5").update(password).digest("hex");
}

async function createUser(
  email: string,
  password_hash: string,
  secureMethod: boolean = true,
  role: string
): Promise<[Models["User"], Models["UserDetails"]] | null> {
  const createdAt = new Date();
  const passwordhash = hashPassword(password_hash, createdAt, secureMethod);

  return withTransaction(async (client) => {
    const newUser = await createUserInDB(client, email, passwordhash, createdAt);
    const newUserDetails = await createUserDetailsInDB(client, newUser.id, newUser.unsafe_id, role);
    return [newUser, newUserDetails];
  });
}

async function findUserByEmail(email: string): Promise<Models["User"] | null> {
  return withTransaction(async (client) => {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  });
}

async function fetchUserDetails(userId: string | null, unsafeId: string | null): Promise<Models["UserDetails"] | null> {
  if (!userId && !unsafeId) {
    throw new Error("Either userId or unsafeId must be provided.");
  }
  const column = userId ? "user_id" : "unsafe_id";
  const value = userId || unsafeId;

  return withTransaction(async (client) => {
    const result = await client.query(`SELECT * FROM user_details WHERE ${column} = $1`, [value]);
    return result.rows[0] || null;
  });
}

async function updateUserDetails(
  userId: string | null,
  unsafeId: string | null,
  details: Partial<Models["UserDetails"]>
): Promise<Models["UserDetails"] | null> {
  if (!userId && !unsafeId) {
    throw new Error("Either userId or unsafeId must be provided.");
  }
  const column = userId ? "user_id" : "unsafe_id";
  const value = userId || unsafeId;

  const keys = Object.keys(details);
  const values = Object.values(details);
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  return withTransaction(async (client) => {
    const result = await client.query(
      `UPDATE user_details SET ${setClause} WHERE ${column} = $${keys.length + 1} RETURNING *`,
      [...values, value]
    );
    return result.rows[0] || null;
  });
}

async function deleteUser(userId: string): Promise<void> {
  return withTransaction(async (client) => {
    await client.query("DELETE FROM users WHERE id = $1", [userId]);
  });
}

export {
  createUser,
  findUserByEmail,
  fetchUserDetails,
  updateUserDetails,
  deleteUser,
};
