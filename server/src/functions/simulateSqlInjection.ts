import pool from "../config/db";

export async function simulateSQLInjection(email: string, password: string) {
  const data = await pool.query(
    `SELECT * FROM users WHERE email = '${email}' AND password_hash = '${password}'`
  );

  const filteredData = data.rows.filter((user: any) =>
    user.email.match(/user[0-9]@example.com/) ||
    user.email.match(process.env.OSINT_EMAIL!)
  );
  return filteredData;
}
