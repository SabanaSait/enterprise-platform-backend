import { Controller, Get, Post } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import type { MetricsResponse } from './types/metrics.types';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  public getMetrics(): MetricsResponse {
    return this.metricsService.getMetrics();
  }

  // TEMP: Used for testing WebSocket emission. Will be removed later.
  @Post('test-update')
  triggerUpdate() {
    return this.metricsService.updateMetrics();
  }
}
