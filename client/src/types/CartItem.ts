import { Product } from "./ProductTypes";

export interface CartItem {
    id: string;
    cart_id: string;
    product: Product;
    product_id: string;
    quantity: number;
    variant: string;
    createdAt: Date;
    updatedAt: Date;
}
