import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';
import { ConversationUpdeteDto } from 'src/ai/dto/update-ai.dto';

@Controller('chat-session')
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}


  


}
