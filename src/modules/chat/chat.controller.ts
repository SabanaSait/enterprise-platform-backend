import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('chat')
export class ChatController {
  @Post('stream')
  async streamChat(@Body('message') message: string, @Res() res: Response) {
    // Set streaming headers
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Simulated AI response (replace later)
    const reply = `AI response to: "${message}"`;

    // Stream character by character
    for (const char of reply) {
      res.write(char);

      // Simulate delay (like real AI)
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    // End stream
    res.end();
  }
}
