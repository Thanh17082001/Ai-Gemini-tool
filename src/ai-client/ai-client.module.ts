import { Module } from '@nestjs/common';
import { AiClientService } from './ai-client.service';
import { AiClientController } from './ai-client.controller';

@Module({
  controllers: [AiClientController],
  providers: [AiClientService],
})
export class AiClientModule {}
