import withTransaction from "../functions/withTransaction";
import { Models } from "../models/Models";



export async function fetchProductById(id: string): Promise<Models["Product"] | null> {
    return withTransaction(async (client) => {
        const result = await client.query("SELECT * FROM products WHERE id = $1", [id]);
        return result.rows[0] || null;
    });
}

export async function fetchProductsByPage(page: number): Promise<Models["Product"][]> {
    return withTransaction(async (client) => {
        const offset = (page - 1) * 12;
        const result = await client.query("SELECT * FROM products ORDER BY id OFFSET $1 LIMIT 12", [offset]);
        return result.rows;
    });
}

export async function fetchProductsByCategory(category: string): Promise<Models["Product"][]> {
    return withTransaction(async (client) => {
        const result = await client.query("SELECT * FROM products WHERE $1 = ANY(categories)", [category]);
        return result.rows;
    });
}

export async function searchProducts(query: string): Promise<Models["Product"][]> {
    return withTransaction(async (client) => {
        const result = await client.query(
            "SELECT * FROM products WHERE title ILIKE $1",
            [`%${query}%`]
        );
        return result.rows;
    });
}




  