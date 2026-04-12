import { Injectable, NotFoundException } from '@nestjs/common';
import { MOCK_USERS } from './mock-users';
import {
  CreateUserDto,
  PaginatedResponse,
  UpdateUserDto,
  User,
} from './types/user.types';
import { UsersGateway } from './users.gateway';
import { UsersQueryDto } from './types/users-query.dto';

@Injectable()
export class UsersService {
  constructor(private usersGateway: UsersGateway) {}
  private usersDB: User[] = [...MOCK_USERS];
  public getAllUsers(query?: UsersQueryDto): PaginatedResponse<User> {
    let users = [...this.usersDB];
    const pageNumber = query?.pageNumber ?? 1;
    const pageSize = query?.pageSize ?? 10;
    const sortBy = query?.sortBy ?? 'name';
    const sortDirection = query?.sortDirection ?? 'asc';
    const search = query?.search ?? '';

    if (search) {
      const term = search.toLowerCase();

      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term),
      );
    }

    users.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;

      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;

      return 0;
    });

    const total = users.length;
    let paginatedUsers = users;

    if (query?.pageNumber !== undefined) {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;

      paginatedUsers = users.slice(start, end);
    }

    return {
      entities: paginatedUsers,
      total,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    };
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
