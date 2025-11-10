import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ai } from './entities/ai.entity';
import { ChatSessionModule } from 'src/chat-session/chat-session.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ai]), forwardRef(()=>ChatSessionModule)],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
