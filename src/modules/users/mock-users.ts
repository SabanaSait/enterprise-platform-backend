import { User } from './types/user.types';

export const MOCK_USERS: User[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@company.com`,
  role: i % 5 === 0 ? 'ADMIN' : i < 25 ? 'USER' : 'SUPERVISOR',
  status: i % 7 === 0 ? 'Inactive' : 'Active',
}));
