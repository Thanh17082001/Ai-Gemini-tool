import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (!apiKey) throw new UnauthorizedException('Bạn không có quyền truy cập!');

        // Tìm key trong ENV
        const secretKeyApp = this.configService.get('app.appKeySecret') || '';

        // So sánh key gửi lên với hash
        const isValid = await bcrypt.compare(secretKeyApp, apiKey.trim().toString());
        // const isValid = apiKey.trim().toString() === hashedKey.trim().toString();
        if (!isValid) throw new UnauthorizedException('Bạn không có quyền truy cập!');

        // Lưu client vào request để controller/service dùng

        return true;
    }
}
