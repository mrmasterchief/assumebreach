export interface User {
  id: string;
  email: string;
  passwordhash: string;
  name: string;
  role: string;
  created_at: Date;
}
