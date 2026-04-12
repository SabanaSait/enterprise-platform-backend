import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto, UpdateUserDto, User } from './types/user.types';
import { UsersQueryDto } from './types/users-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getUsers(@Query() query: UsersQueryDto) {
    const users = this.usersService.getAllUsers(query);

    return users;
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
