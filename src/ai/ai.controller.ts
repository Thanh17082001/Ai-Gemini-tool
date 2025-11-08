import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiService } from './ai.service';
import { Conversation } from './dto/promt.dto';
import { CreateDto } from './dto/create-ai.dto';


@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('conversation')
  async conversation(@Body() conversation: Conversation) {
    return await  this.aiService.generateText(conversation.prompt);
  }

  @Post('key-api')
  async createKeyApi(@Body() createKeyApi: CreateDto) {
    console.log(createKeyApi);
    return await this.aiService.createKeyApi(createKeyApi);
  }

  @Get()
  findAll() {
    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    
  }

  
}
