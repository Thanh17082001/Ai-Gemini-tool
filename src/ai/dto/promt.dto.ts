import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class Conversation {
    @ApiProperty({ description: 'The prompt text to generate a response for.' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500, { message: 'Lời nhắc (prompt) không được vượt quá 500 ký tự.' })
    prompt: string;
}
