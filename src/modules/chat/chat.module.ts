import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LLMModule } from 'src/llm/llm.module';
import { ChatService } from './chat.service';
import { ContextBuilder } from './context-builder.service';
import { MetricsModule } from '../dashboard/metrics/metrics.module';

@Module({
  imports: [LLMModule, MetricsModule],
  controllers: [ChatController],
  providers: [ChatService, ContextBuilder],
})
export class ChatModule {}
