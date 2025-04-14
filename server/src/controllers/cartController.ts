import withTransaction from "../functions/withTransaction";
import { Models } from "../models/Models";
import { fetchProductById } from "./productController";

export async function getCartItems(userId: string): Promise<Models["Cart"][]> {
  return withTransaction(async (client) => {
    let cartID: { rows: { id: string }[] };
    cartID = await client.query("SELECT * FROM carts WHERE user_id = $1", [
      userId,
    ]);
    if (cartID.rows.length === 0) {
      return [];
    }
    const cartItems = await client.query(
      "SELECT * FROM cart_items WHERE cart_id = $1",
      [cartID.rows[0].id]
    );
    const cartItemsWithProductDetails = await Promise.all(
      cartItems.rows.map(async (item: any) => {
        const product = await fetchProductById(item.product_id);
        return {
          ...item,
          product,
        };
      })
    );
    return cartItemsWithProductDetails;
  });
}

export async function addCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<void> {
  return withTransaction(async (client) => {
    let cartID: { rows: { id: string }[] };
    cartID = await client.query("SELECT * FROM carts WHERE user_id = $1", [
      userId,
    ]);
    if (cartID.rows.length === 0) {
      await client.query("INSERT INTO carts (user_id) VALUES ($1)", [userId]);
    }
    cartID = await client.query("SELECT * FROM carts WHERE user_id = $1", [
      userId,
    ]);
    await client.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + $3",
      [cartID.rows[0].id, productId, quantity]
    );
  });
}

export async function removeCartItem(
  userId: string,
  productId: string
): Promise<void> {
  return withTransaction(async (client) => {
    const cartID = await client.query(
      "SELECT * FROM carts WHERE user_id = $1",
      [userId]
    );
    if (cartID.rows.length > 0) {
      await client.query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartID.rows[0].id, productId]
      );
    }
  });
}
export async function clearCart(userId: string): Promise<void> {
  return withTransaction(async (client) => {
    const cartID = await client.query(
      "SELECT * FROM carts WHERE user_id = $1",
      [userId]
    );
    if (cartID.rows.length > 0) {
      await client.query("DELETE FROM cart_items WHERE cart_id = $1", [
        cartID.rows[0].id,
      ]);
    }
  });
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number
): Promise<void> {
  return withTransaction(async (client) => {
    const cartID = await client.query(
      "SELECT * FROM carts WHERE user_id = $1",
      [userId]
    );
    if (cartID.rows.length > 0) {
      await client.query(
        "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3",
        [quantity, cartID.rows[0].id, productId]
      );
    }
  });
}

export async function fetchOrders(userId: string): Promise<Models["Cart"][]> {
  return withTransaction(async (client) => {
    const orders = await client.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [userId]
    );
    const ordersWithProductDetails = await Promise.all(
      orders.rows.map(async (order: any) => { 
        const orderItems = await client.query(
          "SELECT * FROM order_items WHERE order_id = $1",
          [order.id]
        );
        const products = await Promise.all(
          orderItems.rows.map(async (item: any) => {
            const product = await fetchProductById(item.product_id);
            return {
              ...item,
              product,
            };
          })
        );
        return {
          ...order,
          items: products,
        };
      }
    )
    );
    return ordersWithProductDetails;
    
  });
}
