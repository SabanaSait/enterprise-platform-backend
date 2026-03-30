import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import type { User } from './types/user.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getUsers(): User[] {
    return this.usersService.getAllUsers();
  }
}
