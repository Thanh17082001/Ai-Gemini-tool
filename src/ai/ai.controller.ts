import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { Conversation } from './dto/promt.dto';
import { CreateDto } from './dto/create-ai.dto';
import { ApiKeyGuard } from 'src/common/guards/app.guard';
import { ChatSessionService } from 'src/chat-session/chat-session.service';
import { ConversationUpdeteDto } from './dto/update-ai.dto';
import { PaginationDto } from './dto/pagination.dto';


@Controller('ai')
@UseGuards(ApiKeyGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly chatSessionService: ChatSessionService
  ) { }

  @Post('conversation')
  async conversation(@Body() conversation: Conversation, @Req() req: any) {
    return await this.chatSessionService.create(conversation, req.session);
  }

  @Post('key-api')
  async createKeyApi(@Body() createKeyApi: CreateDto) {
    return await this.aiService.createKeyApi(createKeyApi);
  }

  @Patch('conversation/:id')
  async update(@Param('id') id: string,@Body() conversation: ConversationUpdeteDto, @Req() req: any) {
    return await this.chatSessionService.update(id,conversation, req.session);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.chatSessionService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatSessionService.findOne(+id);
  }

  // @Get('thanh/:id')
  // findOne2(@Param('id') id: string) {
  //   return this.chatSessionService.findOne2(+id);
  // }
  
}
