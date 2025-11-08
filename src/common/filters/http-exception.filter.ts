import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Xác định HTTP status code
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Xác định message & errorCode
        let message: string;
        let errorCode = 'UNKNOWN_ERROR';

        if (exception instanceof HttpException) {
            const res = exception.getResponse();

            if (typeof res === 'string') message = res;
            else if (typeof res === 'object') {
                message = (res as any).message || exception.message;
                errorCode = (res as any).error || errorCode;
            } else {
                message = exception.message;
            }
        } else {
            message = exception.message || 'Internal server error';
        }

        // // Log chi tiết ra file (với stack)
        this.logger.error({
            status,
            message,
            errorCode,
            path: request.url,
            method: request.method,
            stack: exception.stack,
        });

        // Trả JSON chuẩn ra client
        response.status(status).json({
            statusCode: status,
            message,
            errorCode,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
