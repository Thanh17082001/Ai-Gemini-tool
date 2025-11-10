import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Type } from 'class-transformer';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Message, ChatSession])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
