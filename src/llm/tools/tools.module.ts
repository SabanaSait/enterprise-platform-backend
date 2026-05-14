import { Module } from '@nestjs/common';
import { MetricsModule } from 'src/modules/dashboard/metrics/metrics.module';
import { MetricsTool } from './metrics.tool';
import { ToolRegistry } from './tool.registry';
import { Tool, TOOLS_TOKEN } from './types/tool.interface';

@Module({
  imports: [MetricsModule],
  providers: [
    MetricsTool,
    {
      provide: TOOLS_TOKEN,
      useFactory: (metricsTool: MetricsTool): Tool[] => [metricsTool],
      inject: [MetricsTool],
    },
    {
      provide: ToolRegistry,
      useFactory: (tools: Tool[]) => new ToolRegistry(tools),
      inject: [TOOLS_TOKEN],
    },
  ],
  exports: [ToolRegistry],
})
export class ToolsModule {}
