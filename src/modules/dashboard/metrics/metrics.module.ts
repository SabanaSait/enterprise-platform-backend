import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { UsersModule } from '../../users/users.module';
import { MetricsGateway } from './metrics.gateway';

@Module({
  imports: [UsersModule],
  controllers: [MetricsController],
  providers: [MetricsService, MetricsGateway],
  exports: [MetricsService],
})
export class MetricsModule {}
