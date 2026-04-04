import { Module } from '@nestjs/common';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { MetricsController } from './modules/dashboard/metrics/metrics.controller';
import { MetricsModule } from './modules/dashboard/metrics/metrics.module';

@Module({
  imports: [UsersModule, MetricsModule],
  controllers: [MetricsController, UsersController],
})
export class AppModule {}
