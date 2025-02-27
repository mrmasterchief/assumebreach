import { User } from "../models/User";
import pool from "../config/db";
import { RBAC } from "../middleware/rbac";
import bcrypt from "bcryptjs";

async function findUserByEmail(email: string): Promise<User | null> {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return user.rows[0];
}

async function fetchUserInformation(id: string): Promise<User | null> {
  const user = await pool.query(
    "SELECT id, email, name, role FROM users WHERE id = $1",
    [id]
  );
  return user.rows[0];
}

async function findUserById(id: string): Promise<User | null> {
  const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return user.rows[0];
}

async function createUser(
  email: string,
  password: string,
  name: string,
  role: RBAC
): Promise<User> {
  const passwordhash = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: "",
    email,
    passwordhash,
    name,
    role,
  };
  const user = await pool.query(
    "INSERT INTO users (email, passwordhash, name, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [newUser.email, newUser.passwordhash, newUser.name, newUser.role]
  );
  return newUser;
}

async function updateUser(id: string, user: User): Promise<User | null> {
  const updatedUser = await pool.query(
    "UPDATE users SET email = $1, passwordhash = $2, name = $3, role = $4 WHERE id = $5 RETURNING *",
    [user.email, user.passwordhash, user.name, user.role, id]
  );
  return updatedUser.rows[0];
}

async function deleteUser(id: string): Promise<User | null> {
  const deletedUser = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return deletedUser.rows[0];
}

async function blacklistToken(token: string): Promise<void> {
  try {
    await pool.query("INSERT INTO blacklisted_tokens (token) VALUES ($1)", [
      token,
    ]);
  } catch (error) {
    console.error("Error blacklisting token:", error);
    throw error;
  }
}

async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const result = await pool.query(
      "SELECT 1 FROM blacklisted_tokens WHERE token = $1",
      [token]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking blacklist:", error);
    throw error;
  }
}

export {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  blacklistToken,
  isTokenBlacklisted,
  fetchUserInformation,
};
