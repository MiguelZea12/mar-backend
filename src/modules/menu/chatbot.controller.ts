import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async handleChat(@Body('message') message: string) {
    const result = await this.chatbotService.handleQuestion(message);
    return { response: result.reply };
  }
} 