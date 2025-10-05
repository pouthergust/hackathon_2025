import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('v0/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send')
  async sendMessage(@Body('message') message: string): Promise<string> {
    return await this.messagesService.sendMessage(message);
  }
}
