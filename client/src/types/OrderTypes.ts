export interface Order {
    id: number;
    cart_id: string;
    total_price: string;
    address: {
        zip: string;
        city: string;
        state: string;
        country: string;   
    };
    payment_method: string;
    status: string;
    created_at: string;
    updated_at: string;
}