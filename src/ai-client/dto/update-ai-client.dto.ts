import { PartialType } from '@nestjs/swagger';
import { CreateAiClientDto } from './create-ai-client.dto';

export class UpdateAiClientDto extends PartialType(CreateAiClientDto) {}
