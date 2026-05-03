import { Module } from '@nestjs/common';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { MetricsController } from './modules/dashboard/metrics/metrics.controller';
import { MetricsModule } from './modules/dashboard/metrics/metrics.module';
import { ChatController } from './modules/chat/chat.controller';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [UsersModule, MetricsModule, ChatModule],
})
export class AppModule {}
