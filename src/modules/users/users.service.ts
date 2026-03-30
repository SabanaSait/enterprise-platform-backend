import { Injectable } from '@nestjs/common';
import { MOCK_USERS } from './mock-users';
import { User } from './types/user.types';

@Injectable()
export class UsersService {
  public getAllUsers(): User[] {
    return MOCK_USERS;
  }
}
