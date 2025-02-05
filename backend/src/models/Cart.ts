import { CartItem } from './CartItem.js';

export interface Cart {
    userId: string;
    items: CartItem[];
}