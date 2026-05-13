import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LLMModule } from 'src/llm/llm.module';

@Module({
  imports: [LLMModule],
  controllers: [ChatController],
})
export class ChatModule {}
