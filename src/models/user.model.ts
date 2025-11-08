
export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}
