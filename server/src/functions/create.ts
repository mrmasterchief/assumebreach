import { Models } from "../models/Models";
import { RBAC } from "../middleware/rbac";

export async function createUserInDB(
    client: any,
    email: string,
    passwordHash: string,
    createdAt: Date
  ): Promise<Models["User"]> {
    const result = await client.query(
      "INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, $3) RETURNING *",
      [email, passwordHash, createdAt]
    );
    return result.rows[0];
  }
  
export async function createUserDetailsInDB(
    client: any,
    user_id: string,
    unsafe_id: string,
    role: string
  ): Promise<Models["UserDetails"]> {
    const result = await client.query(
      "INSERT INTO user_details (user_id, unsafe_id, role) VALUES ($1, $2, $3) RETURNING *",
      [user_id, unsafe_id, role || RBAC.USER]
    );
    return result.rows[0];
  }
  