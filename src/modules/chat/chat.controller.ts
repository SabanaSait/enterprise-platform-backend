import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LLMService } from 'src/llm/llm.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly llmService: LLMService) {}

  @Post('stream')
  async streamChat(@Body('message') message: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = this.llmService.stream(message);

    // Stream character by character
    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  }
}
