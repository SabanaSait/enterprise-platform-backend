import { Module } from '@nestjs/common';
import { MetricsController } from './modules/metrics/metrics.controller';
import { MetricsService } from './modules/metrics/metrics.service';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [UsersModule, MetricsModule],
  controllers: [MetricsController, UsersController],
  providers: [MetricsService, UsersService],
})
export class AppModule {}
