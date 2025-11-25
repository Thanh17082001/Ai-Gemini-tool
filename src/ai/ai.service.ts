import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Content, GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { GEMINI_FINISH_REASONS } from './constants/errors';
import { FinishReasonKey } from './interface/finishReason';
import { CreateDto } from './dto/create-ai.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ai } from './entities/ai.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginationAiDto } from './dto/pagination.ai.dto';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  private model: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Ai) private repoAi: Repository<Ai>,
  ) { }
  // Lấy API Key từ DB theo code
  private async getApiKey(code: string, session: any): Promise<Ai> {

    if (session.ai?.code === code) {
      return session.ai;
    }

    console.log('đến đây');
    const ai = await this.findOne(code);

    if (!ai) {
      throw new BadRequestException('Không tìm thấy API Key GEMINI trong cơ sở dữ liệu');
    }

    session.ai = ai;

    return ai;
  }
  // Khởi tạo GoogleGenAI client
  private async initAiClient(code, sessionStore: Record<string, any>) {
    const ai = await this.getApiKey(code, sessionStore);
    this.ai = new GoogleGenAI({ apiKey: ai.key });
    this.model = ai.model || 'gemini-2.5-flash';
  }

  async generateText(prompt: string, code: string, sessionStore: Record<string, any>, histories: { role: string; content: string }[] = []): Promise<string | undefined> {
    try {
      //khỏi tạo
      await this.initAiClient(code, sessionStore);
      const systemInstruction =
        'Bạn là một chuyên gia trong lĩnh vực giáo dục tại Việt Nam, luôn cung cấp câu trả lời chính xác và chi tiết. và trả về dưới dạng tiếng Việt dạng .md';

      // 1. Xây dựng mảng Contents
      const contents: Content[] = [];

      // HISTORY (nếu có)
      for (const msg of histories) {
        contents.push({
          role: msg.role == 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }

      // USER PROMPT (hiện tại)
      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: contents,
        config: {
          temperature: 0.7,
          systemInstruction: systemInstruction,
        },
      });


      // 1. KIỂM TRA LỖI LOGIC TẠO SINH DỰA TRÊN CONSTANTS
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        // Ép kiểu để sử dụng làm key trong object hằng số
        const finishReason = candidate.finishReason as FinishReasonKey;

        // 1.1. Trường hợp THÀNH CÔNG (finishReason === 'STOP')
        if (finishReason === 'STOP') {
          if (
            candidate.content &&
            candidate.content.parts &&
            candidate.content.parts[0].text
          ) {
            return candidate.content.parts[0].text;
          }
        }

        // 1.2. Trường hợp LỖI TẠO SINH (Sử dụng GEMINI_FINISH_REASONS)
        const errorDetail = GEMINI_FINISH_REASONS[finishReason];

        if (errorDetail) {
          // Ném HttpException với cấu trúc code/message/status đã định nghĩa
          throw new HttpException(
            {
              code: errorDetail.code,
              message: errorDetail.message,
            },
            400,
          );
        }

        // Trường hợp trả về mã finishReason không xác định
        throw new InternalServerErrorException(
          'Hệ thống đang bảo trì, vui lòng thử lại sau.',
        );
      }

      // Trường hợp không có candidates
      throw new InternalServerErrorException(
        'Hệ thống đang bảo trì, vui lòng thử lại sau.',
      );
    } catch (error) {
      // 2. BẮT LỖI HTTP/MẠNG (như 429 RESOURCE_EXHAUSTED)
      // Phần này vẫn cần kiểm tra lỗi HTTP thô từ SDK
      const errorMessage = (error.message || '').toUpperCase();

      if (
        errorMessage.includes('RESOURCE_EXHAUSTED') ||
        errorMessage.includes('429')
      ) {
        throw new HttpException(
          'Đã hết giới hạn sử dụng miễn phí (quota). Thử lại sau.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Nếu lỗi đã là HttpException (do logic ở trên ném ra), ném lại nó.
      if (error instanceof HttpException) {
        throw error;
      }


      // Lỗi mạng, I/O hoặc lỗi SDK không xác định khác
      throw new InternalServerErrorException(
        'Lỗi kết nối hoặc lỗi máy chủ đang bảo trì,vui lòng thử lại sau.',
      );
    }
  }

  async createKeyApi(createDto: CreateDto): Promise<{ code: string }> {
    let code: string = '';
    let exists = true;

    const password = 'gdvn@2025';

    // check password khi tạo key
    if (createDto.password !== password) {
      throw new ForbiddenException('Không có quyền thêm key');
    }

    // check tồn tại key trong DB
    const keyExists = await this.repoAi.findOne({
      where: { key: createDto.key },
    });
    if (!!keyExists) {
      throw new BadRequestException('Key đã tồn tại');
    }

    // check tồn tại mã code nếu tồn tại thì tạo tiếp mã mới
    while (exists) {
      // random từ 00000 → 99999
      const randomNum = Math.floor(Math.random() * 100000);
      const formattedNum = randomNum.toString().padStart(5, '0'); // thêm số 0 ở đầu
      code = `DN${formattedNum}`;

      const found = await this.repoAi.findOne({ where: { code } });
      exists = !!found;
    }

    const ai = await this.repoAi.save({
      key: createDto.key,
      model: createDto.model,
      code: code.toString(),
      shool: createDto.school,
    });

    return {
      code: ai.code,
    };
  }

  async findOne(code: string): Promise<Ai | null> {
    return this.repoAi.findOne({ where: { code } });
  }

  async findAll(pagination: PaginationAiDto) {
    const query = this.repoAi.createQueryBuilder('ai');
    const { search, page, limit } = pagination;
    if (search) {
      const s = `%${search.toLowerCase().trim()}%`;
      query.andWhere(`
      LOWER(ai.code) LIKE :s 
      OR LOWER(ai.shool) LIKE :s
    `, { s });
    }


    query.orderBy('ai.createdAt', 'DESC');

    const [data, total] = await query
      .skip((+page - 1) * +limit)
      .take(+limit)
      .getManyAndCount();
    return {
      result: data,
      total: total,
      resultTotal: data.length,
      page: +page,
      limit: +limit,
    }
  }
}
