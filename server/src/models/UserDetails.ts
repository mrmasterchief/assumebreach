export interface UserDetails {
    id: string;
    unsafe_id: string;
    full_name: string;
    address: string;
    phone: string;
    score: number;
    collected_flags: string[];
    birth_date: Date;    
    role: string;
    created_at: Date;
  }
  