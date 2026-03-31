import { Module } from '@nestjs/common';
import { MetricsController } from './modules/metrics/metrics.controller';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [UsersModule, MetricsModule],
  controllers: [MetricsController, UsersController],
})
export class AppModule {}
