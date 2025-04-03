import pool from "../config/db";


export default async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Database transaction error:", error);
      throw error;
    } finally {
      client.release();
    }
}