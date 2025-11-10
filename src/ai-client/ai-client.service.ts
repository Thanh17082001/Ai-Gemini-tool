import { Injectable } from '@nestjs/common';
import { CreateAiClientDto } from './dto/create-ai-client.dto';
import { UpdateAiClientDto } from './dto/update-ai-client.dto';

@Injectable()
export class AiClientService {
  create(createAiClientDto: CreateAiClientDto) {
    return 'This action adds a new aiClient';
  }

  findAll() {
    return `This action returns all aiClient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiClient`;
  }

  update(id: number, updateAiClientDto: UpdateAiClientDto) {
    return `This action updates a #${id} aiClient`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiClient`;
  }
}
