export interface OrderDetailsProps {
    orderDetails: {
        id: number;
        cart_id: string;
        total_price: string;
        address: {
            zip: string;
            city: string;
            state: string;
            country: string;
        };
        items: Array<{
            product: {
                id: string;
                title: string;
                description: string;
                price: string;
                discountprice: string;
                imagepath: string;
                categories: Array<string>;
                style: string;
                created_at: string;
                updated_at: string;
            };
            quantity: number;
        }>;
        payment_method: string;
        status: string;
        created_at: string;
        updated_at: string;
        user_id: string;
        flag?: string;
    };
}
