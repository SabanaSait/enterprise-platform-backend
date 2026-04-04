import { Injectable, NotFoundException } from '@nestjs/common';
import { MOCK_USERS } from './mock-users';
import { CreateUserDto, UpdateUserDto, User } from './types/user.types';
import { UsersGateway } from './users.gateway';

@Injectable()
export class UsersService {
  constructor(private usersGateway: UsersGateway) {}
  private usersDB: User[] = [...MOCK_USERS];
  public getAllUsers(): User[] {
    return this.usersDB;
  }

  public getUser(id: string): User {
    const user = this.usersDB.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  public create(dto: CreateUserDto): User {
    const user = {
      id: crypto.randomUUID(),
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.usersDB.push(user);
    this.usersGateway.emitUsersUpdate({
      action: 'created',
      data: user,
    });

    return user;
  }

  public update(id: string, dto: UpdateUserDto): User {
    const user = this.getUser(id);
    Object.assign(user, dto, {
      updatedAt: new Date().toISOString(),
    });

    this.usersGateway.emitUsersUpdate({
      action: 'updated',
      data: user,
    });

    return user;
  }

  public delete(id: string): User {
    const user = this.getUser(id);
    this.usersDB = this.usersDB.filter((user) => user.id !== id);

    this.usersGateway.emitUsersUpdate({
      action: 'deleted',
      data: user,
    });

    return user;
  }
}
