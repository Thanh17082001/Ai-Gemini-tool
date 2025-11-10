import { forwardRef, Module } from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { ChatSessionController } from './chat-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { Ai } from 'src/ai/entities/ai.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, Ai]), MessagesModule, forwardRef(()=>AiModule)],
  controllers: [ChatSessionController],
  providers: [ChatSessionService],
  exports: [ChatSessionService],
})
export class ChatSessionModule {}
