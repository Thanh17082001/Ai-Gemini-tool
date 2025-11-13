import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsIn, IsNotEmpty } from 'class-validator';

export class PaginationDto {
    @ApiProperty({ default: 1, description: 'Số trang (mặc định: 1)' })
    @Type(() => Number) // ép kiểu từ string → number
    @IsInt({ message: 'Trang phải là số nguyên' })
    @Min(1, { message: 'Trang phải >= 1' })
    page: number = 1;

    @ApiProperty({ default: 10, description: 'Số bản ghi mỗi trang (mặc định: 10)' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @ApiProperty({required:false, description: 'Từ khóa tìm kiếm'})
    @IsString()
    search?: string='';

    @ApiProperty({required:true, description: 'Mã định danh AI'})
    @IsNotEmpty()
    @IsString()
    code: string;
}