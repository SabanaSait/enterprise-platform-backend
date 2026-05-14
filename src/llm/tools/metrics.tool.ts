import { Injectable } from '@nestjs/common';
import { MetricsResult, Tool } from './types/tool.interface';
import { MetricsService } from 'src/modules/dashboard/metrics/metrics.service';

@Injectable()
export class MetricsTool implements Tool<void, any> {
  readonly name = 'getDashboardMetrics';
  readonly description = 'fetches dashboard metrics like users data';

  constructor(private readonly metricsService: MetricsService) {}
  async execute(): Promise<MetricsResult> {
    const data = this.metricsService.getMetrics();

    return {
      success: true,
      data,
    };
  }
}
