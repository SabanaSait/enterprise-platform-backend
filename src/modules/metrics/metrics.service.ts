import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MetricsResponse } from './types/metrics.types';

@Injectable()
export class MetricsService {
  constructor(private readonly usersService: UsersService) {}

  public getMetrics(): MetricsResponse {
    const users = this.usersService.getAllUsers();

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'Active').length;
    const inactiveUsers = users.filter((u) => u.status === 'Inactive').length;

    const adminUsersCount = users.filter((u) => u.role === 'ADMIN').length;
    const supervisorsCount = users.filter(
      (u) => u.role === 'SUPERVISOR',
    ).length;
    const generalUsersCount = users.filter((u) => u.role === 'USER').length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsersCount,
      supervisorsCount,
      generalUsersCount,
      timestamp: new Date().toISOString(),
    };
  }
}
