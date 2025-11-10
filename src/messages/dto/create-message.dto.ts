import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
    @IsString()
    role?: string = 'user';
    
    @ApiProperty({ description: 'Nội dung tin nhắn' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: 'ID phiên trò chuyện liên quan đến tin nhắn' })
    @IsNotEmpty()
    @IsString()
    sessionId: string;
}
