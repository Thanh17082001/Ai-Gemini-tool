import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateChatSessionDto {
    // @ApiProperty({ description: 'AI code associated with the chat session' })
    // @IsNotEmpty()
    // @IsString()
    // code: string;

    // @ApiProperty({ description: 'Title of the chat session', required: false })
    // @IsString()
    // title?: string;

    // @ApiProperty({ description: 'Initial total tokens for the chat session', required: false, default: 0 })
    // totalTokens?: number = 0;

}
