// src/common/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.config';

@Global() // Dùng ở mọi nơi mà không cần import lại
@Module({
    imports: [WinstonModule.forRoot(winstonConfig)],
    exports: [WinstonModule],
})
export class LoggerModule { }
