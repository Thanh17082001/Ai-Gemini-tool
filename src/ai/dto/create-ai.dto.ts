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

    @ApiPropertyOptional({
        description: 'Tên model AI muốn sử dụng. Nếu bỏ trống, mặc định là "gemini-2.5-flash". Ví dụ: "gemini-2.5-flash", "gemini-3"…',
        example: 'gemini-2.5-flash',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value ?? 'gemini-2.5-flash')
    model?: string;
}
