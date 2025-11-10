import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ConversationUpdeteDto {
    @ApiProperty({ description: 'The prompt text to generate a response for.' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500, { message: 'Lời nhắc (prompt) không được vượt quá 500 ký tự.' })
    prompt: string;

    @ApiProperty({ description: 'Mã định danh để sử dụng Ai' })
    @IsString()
    @IsNotEmpty()
    code: string;
}
