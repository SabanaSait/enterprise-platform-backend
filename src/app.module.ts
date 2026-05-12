import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { MetricsModule } from './modules/dashboard/metrics/metrics.module';
import { ChatModule } from './modules/chat/chat.module';
import { LLMModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    MetricsModule,
    ChatModule,
    LLMModule,
  ],
})
export class AppModule {}
