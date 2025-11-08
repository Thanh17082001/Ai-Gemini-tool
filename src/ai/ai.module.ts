import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ai } from './entities/ai.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Ai])],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
