import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateDto {
    @ApiProperty({ description: 'Nhập api key' })
    @IsString()
    @IsNotEmpty()
    key: string;
   
    @ApiProperty({ description: 'password' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiPropertyOptional({ description: 'Nhập model (mặc định: gemini-2.5-flash)' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value || 'gemini-2.5-flash')
    model?: string;
}
