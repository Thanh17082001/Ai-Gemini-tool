import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private repoMessage: Repository<Message>,
    @InjectRepository(ChatSession) private repoChatSession: Repository<ChatSession>,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const chatSession = await  this.repoChatSession.findOne({where: {id: parseInt(createMessageDto.sessionId)}});
    if (!chatSession){
      throw new Error('Phiên chat không tồn tại');
    }
    return this.repoMessage.save({
      session: chatSession,
      role: createMessageDto.role,
      content: createMessageDto.content,
      tokenCount:  0,
    });
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
