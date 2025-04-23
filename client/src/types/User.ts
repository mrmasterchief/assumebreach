export interface User {
    id: string;
    full_name: string;
    email: string;
    password_hash: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
        created_at: string;
        updated_at: string;
}