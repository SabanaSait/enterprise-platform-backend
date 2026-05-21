import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ChatService } from './chat.service';
import { CopilotContext } from './context/context.types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('stream')
  async streamChat(
    @Body() body: { message: string; context?: CopilotContext },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { message, context } = body;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    req.on('close', () => {
      console.log('Client disconnected');
    });

    try {
      const result = await this.chatService.handleMessage(message, context);

      if (this.isAsyncIterable(result)) {
        for await (const chunk of result) {
          res.write(chunk);
        }
        res.end();
      } else {
        res.write(typeof result === 'string' ? result : JSON.stringify(result));
        res.end();
      }
    } catch (error) {
      console.error('[ChatController] Streaming error:', error);

      res.status(500).end('Error generating response');
    }
  }

  private isAsyncIterable(value: any): value is AsyncIterable<string> {
    return value && typeof value === 'object' && Symbol.asyncIterator in value;
  }
}
