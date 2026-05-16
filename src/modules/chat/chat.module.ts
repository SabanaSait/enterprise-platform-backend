import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LLMModule } from 'src/llm/llm.module';
import { ChatService } from './chat.service';
import { MetricsModule } from '../dashboard/metrics/metrics.module';
import { ToolsModule } from 'src/llm/tools/tools.module';

@Module({
  imports: [LLMModule, MetricsModule, ToolsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
