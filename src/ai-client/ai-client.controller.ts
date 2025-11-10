import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiClientService } from './ai-client.service';
import { CreateAiClientDto } from './dto/create-ai-client.dto';
import { UpdateAiClientDto } from './dto/update-ai-client.dto';

@Controller('ai-client')
export class AiClientController {
  constructor(private readonly aiClientService: AiClientService) {}

  @Post()
  create(@Body() createAiClientDto: CreateAiClientDto) {
    return this.aiClientService.create(createAiClientDto);
  }

  @Get()
  findAll() {
    return this.aiClientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiClientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiClientDto: UpdateAiClientDto) {
    return this.aiClientService.update(+id, updateAiClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiClientService.remove(+id);
  }
}
