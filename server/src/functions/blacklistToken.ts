import pool from "../config/db";

export async function blacklistToken(token: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("INSERT INTO blacklisted_tokens (token) VALUES ($1)", [token]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error blacklisting token:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  
export async function isTokenBlacklisted(token: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT 1 FROM blacklisted_tokens WHERE token = $1", [token]);
      return result.rows.length > 0;
    } catch (error) {
      console.error("Error checking if token is blacklisted:", error);
      throw error;
    } finally {
      client.release();
    }
  }