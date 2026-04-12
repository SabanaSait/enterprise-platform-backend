import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { MetricsResponse } from './types/metrics.types';
import { MetricsGateway } from './metrics.gateway';

@Injectable()
export class MetricsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly gateway: MetricsGateway,
  ) {}

  public getMetrics(): MetricsResponse {
    const { entities, total } = this.usersService.getAllUsers();

    const activeUsers = entities.filter((u) => u.status === 'Active').length;
    const inactiveUsers = entities.filter(
      (u) => u.status === 'Inactive',
    ).length;

    const adminUsersCount = entities.filter((u) => u.role === 'ADMIN').length;
    const supervisorsCount = entities.filter(
      (u) => u.role === 'SUPERVISOR',
    ).length;
    const generalUsersCount = entities.filter((u) => u.role === 'USER').length;

    return {
      totalUsers: total,
      activeUsers,
      inactiveUsers,
      adminUsersCount,
      supervisorsCount,
      generalUsersCount,
      timestamp: new Date().toISOString(),
    };
  }

  public async updateMetrics() {
    const metrics = this.getMetrics();

    // real-time updates
    this.gateway.emitMetricsUpdate(metrics);

    return metrics;
  }
}
