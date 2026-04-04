import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto, UpdateUserDto, User } from './types/user.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getUsers() {
    const users = this.usersService.getAllUsers();

    return {
      entities: users,
      total: users.length,
    };
  }

  @Get(':id')
  public getUser(@Param('id') id: string) {
    const user = this.usersService.getUser(id);

    return user;
  }

  @Post()
  public createUser(@Body() dto: CreateUserDto): User {
    return this.usersService.create(dto);
  }

  @Put(':id')
  public updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto): User {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  public deleteUser(@Param('id') id: string): User {
    return this.usersService.delete(id);
  }
}
