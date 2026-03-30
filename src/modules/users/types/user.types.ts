export type UserStatus = 'Active' | 'Inactive';
export type UserRole = 'ADMIN' | 'USER' | 'SUPERVISOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
