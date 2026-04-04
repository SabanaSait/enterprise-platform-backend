export type UserStatus = 'Active' | 'Inactive';
export type UserRole = 'ADMIN' | 'USER' | 'SUPERVISOR';

export interface BaseUser {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface User extends BaseUser {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserDto = BaseUser;

export type UpdateUserDto = Partial<CreateUserDto>;
