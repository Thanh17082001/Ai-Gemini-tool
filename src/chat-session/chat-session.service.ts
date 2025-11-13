import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ai } from 'src/ai/entities/ai.entity';
import { Repository } from 'typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Conversation } from 'src/ai/dto/promt.dto';
import { MessagesService } from 'src/messages/messages.service';
import { AiService } from 'src/ai/ai.service';
import { Message } from 'src/messages/entities/message.entity';
import { ConversationUpdeteDto } from 'src/ai/dto/update-ai.dto';
import { generateTitleFromPrompt } from 'src/common/constants/generateTitle';
import { PaginationDto } from 'src/ai/dto/pagination.dto';

@Injectable()
export class ChatSessionService {
  constructor(
    @InjectRepository(Ai) private repoAi: Repository<Ai>,
    @InjectRepository(ChatSession) private repoChatSession: Repository<ChatSession>,
    @InjectRepository(Message) private repoMessage: Repository<Message>,
    private readonly messageService: MessagesService,
    private readonly aiService: AiService,
    ) {}
  async create(conversation: Conversation, sessionStore: Record<string, any> ) {
    const { code, prompt } = conversation;
    const ai = await this.repoAi.findOne({ where: { code: code } });

    if(!ai){
      throw new BadRequestException('Mã định danh ko hợp lệ');
    }

    const chatSession = await this.repoChatSession.save({
      ai: ai,
      title: generateTitleFromPrompt(prompt),
      totalTokens: 0,
    })

    // user hỏi lưu vào DB và gửi đi ai trả lời
    const messageCreateDtoUser: CreateMessageDto = {
      sessionId: chatSession.id.toString(),
      content: conversation.prompt,
      role: 'user',
    }
    let messages: Message[] = [];

    const message = await this.messageService.create(messageCreateDtoUser) as unknown as Message;
    messages.push(message);

  
      const responseAi = await this.aiService.generateText(conversation.prompt, code, sessionStore);
      const messageCreateDtoAI: CreateMessageDto = {
        sessionId: (await chatSession).id.toString(),
        content: responseAi || 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
        role: 'system',
      }
    const messageAI = await this.messageService.create(messageCreateDtoAI) as unknown as Message;
    messages.push(messageAI);

    chatSession.messages = messages;
    chatSession.totalTokens += Math.round((prompt.length + (responseAi?.length ?? 0)) / 4);
    return this.repoChatSession.save(chatSession);
  }

  
  async update( id:string,conversation: ConversationUpdeteDto, sessionStore: Record<string, any>) {
    const { code,prompt } = conversation;
    const ai = await this.repoAi.findOne({ where: { code: code } });

    if (!ai) {
      throw new BadRequestException('Mã định danh ko hợp lệ');
    }
    const chatSession = await this.repoChatSession.findOne({
      where: { id: parseInt(id) },
      relations: ['messages'],
    })

    if(!chatSession){
      throw new BadRequestException('Phiên trò chuyện không tồn tại');
    }

    // 3️⃣ Lưu tin nhắn của user
    const userMessage = await this.messageService.create({
      sessionId: chatSession.id.toString(),
      content: prompt,
      role: 'user',
    });

    // 4️⃣ Gửi tới AI và nhận phản hồi
    const start = Date.now();
    const responseAi = await this.aiService.generateText(prompt, code, sessionStore);
    const end = Date.now();

    // 5️⃣ Lưu tin nhắn AI trả lời
    const aiMessage = await this.messageService.create({
      sessionId: chatSession.id.toString(),
      content: responseAi || 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
      role: 'system',
    });

    chatSession.messages.push(userMessage as unknown as Message);
    chatSession.messages.push(aiMessage as unknown as Message);

    // 6️⃣ Cập nhật thống kê (nếu có)
    chatSession.totalTokens += Math.round((prompt.length + (responseAi?.length ?? 0)) / 4); // ví dụ tạm tính token
    await this.repoChatSession.save(chatSession);
    return "Thành công";
  }

  async findOne(id: number) {
    const session = await this.repoChatSession.findOne({
      where: { id },
      relations: ['messages'],
    });
    return session;
  }

  async findOne2(id: number, page = 1, limit = 10) {
    const [session, messages, total] = await Promise.all([
      this.repoChatSession.findOne({ where: { id } }),
      this.repoMessage.find({
        where: { session: { id } },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.repoMessage.count({ where: { session: { id } } }),
    ]);

    if (!session) throw new NotFoundException('Phiên chat không tồn tại');

    return {
      ...session,
      messages: {
        result: messages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      
    };
  }

  async findAll(pagination: PaginationDto) {
    const query = this.repoChatSession.createQueryBuilder('session');
    const { search,page, limit } = pagination;
    if (search) {
      query.andWhere('LOWER(session.title) LIKE :search', { search: `%${search.toLowerCase().trim()}%` });
    }

    
    
    query.orderBy('session.updatedAt', 'DESC');

    const [data, total] = await query
      .skip((+page - 1) * +limit)
      .take(+limit)
      .getManyAndCount();
    return {
      result: data,
      total: total,
      resultTotal:data.length,
      page: +page,
      limit: +limit,
    }
  }
}
