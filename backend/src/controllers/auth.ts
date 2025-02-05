import { User } from "../models/User";
import pool from "../config/db";
import { RBAC } from "../middleware/rbac";
import bcrypt from "bcrypt";

async function findUserByEmail(email: string): Promise<User | null> {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
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
  const passwordHash = await bcrypt.hash(password, 10); 
  const newUser: User = {
    id: "",
    email,
    passwordHash,
    name,
    role,
  };
  const user = await pool.query(
    "INSERT INTO users (email, passwordHash, name, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [newUser.email, newUser.passwordHash, newUser.name, newUser.role]
  );
  return newUser;
}

async function updateUser(id: string, user: User): Promise<User | null> {
  const updatedUser = await pool.query(
    "UPDATE users SET email = $1, passwordHash = $2, name = $3, role = $4 WHERE id = $5 RETURNING *",
    [user.email, user.passwordHash, user.name, user.role, id]
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

export { findUserByEmail, findUserById, createUser, updateUser, deleteUser };
