import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Content, GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { GEMINI_FINISH_REASONS } from './constants/errors';
import { FinishReasonKey } from './interface/finishReason';
import { CreateDto } from './dto/create-ai.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ai } from './entities/ai.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  private model: string = 'gemini-2.5-flash';
  constructor(private readonly configService: ConfigService, @InjectRepository(Ai) private repoAi: Repository<Ai>) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.ai = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  async generateText(prompt: string): Promise<string | undefined> {
    try {

      const systemInstruction = "Bạn là một chuyên gia trong lĩnh vực giáo dục tại Việt Nam, luôn cung cấp câu trả lời chính xác và chi tiết. và trả về dưới dạng json.";

      // 1. Xây dựng mảng Contents
      const contents: Content[] = [];

      // Thêm System Instruction nếu tồn tại
      if (systemInstruction) {
        contents.push({
          role: "system",
          parts: [{ text: systemInstruction }]
        });
      }

      // Thêm Prompt của người dùng
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });

     
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          temperature: 0.7,
          // maxOutputTokens: maxTokens,
        }
      });

      // 1. KIỂM TRA LỖI LOGIC TẠO SINH DỰA TRÊN CONSTANTS
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        // Ép kiểu để sử dụng làm key trong object hằng số
        const finishReason = candidate.finishReason as FinishReasonKey;

        // 1.1. Trường hợp THÀNH CÔNG lý tưởng (finishReason === 'STOP')
        if (finishReason === 'STOP') {
          if (candidate.content && candidate.content.parts && candidate.content.parts[0].text) {
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
            400
          );
        }

        // Trường hợp trả về mã finishReason không xác định
        throw new InternalServerErrorException('Lỗi tạo sinh nội dung không xác định.');
      }

      // Trường hợp không có candidates
      throw new InternalServerErrorException('Mô hình trả về phản hồi rỗng hoặc không hợp lệ.');

    } catch (error) {
      // 2. BẮT LỖI HTTP/MẠNG (như 429 RESOURCE_EXHAUSTED)
      // Phần này vẫn cần kiểm tra lỗi HTTP thô từ SDK
      const errorMessage = (error.message || '').toUpperCase();

      if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
        throw new HttpException(
          'Đã hết giới hạn sử dụng miễn phí (quota). Thử lại sau.',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      // Nếu lỗi đã là HttpException (do logic ở trên ném ra), ném lại nó.
      if (error instanceof HttpException) {
        throw error;
      }

      // Lỗi mạng, I/O hoặc lỗi SDK không xác định khác
      throw new InternalServerErrorException('Lỗi kết nối hoặc lỗi máy chủ không xác định khi gọi API.');
    }
  }

  async createKeyApi(createDto: CreateDto) : Promise<{code: string}> {
    let code: string = '';
    let exists = true;

    const password = "gdvn@2025"
    
    // check password khi tạo key
    if (createDto.password !== password) {
      throw new ForbiddenException('Không có quyền thêm key')
    }

    // check tồn tại key trong DB
    const keyExists = await this.repoAi.findOne({ where: { key:createDto.key } })
    if (!!keyExists) {
      throw new BadRequestException('Key đã tồn tại')
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

    const ai=await this.repoAi.save({
      key: createDto.key,
      model: createDto.model,
      code: code.toString(),
    });

    return {
      code:ai.code
    }
  }


  
}
