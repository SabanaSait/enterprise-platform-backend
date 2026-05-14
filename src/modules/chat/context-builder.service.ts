import { Injectable } from '@nestjs/common';
import { MetricsService } from '../dashboard/metrics/metrics.service';

@Injectable()
export class ContextBuilder {
  constructor(private readonly metricsService: MetricsService) {}

  async build(userMessage: string): Promise<string> {
    const metrics = this.metricsService.getMetrics();

    const context = `
      ### Dashboard metrics (ONLY use these):
      - Total users: ${metrics.totalUsers}
      - Active users: ${metrics.activeUsers}
      - Inactive users: ${metrics.inactiveUsers}
      - Admin: ${metrics.adminUsersCount}
      - Supervisor: ${metrics.supervisorsCount}
      - User: ${metrics.generalUsersCount}
      `;

    return `${context} 
    User Question: ${userMessage}`;
  }
}
