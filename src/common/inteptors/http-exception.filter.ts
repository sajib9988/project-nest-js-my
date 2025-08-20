// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let messages: { message: string; property: string }[] = [];

    if (exception instanceof HttpException) {
      const res: any = exception.getResponse();

      // যদি class-validator error হয়
      if (typeof res === 'object' && res.message && Array.isArray(res.message)) {
        messages = res.message.map((msg: string) => ({
          message: msg,
          property: res.error || 'validation',
        }));
      } else {
        messages = [
          {
            message: res.message || res || 'Unexpected error',
            property: (res.error as string) || 'error',
          },
        ];
      }
    } else {
      // অন্য কোনো unexpected error
      messages = [{ message: 'Internal server error', property: 'server' }];
    }

    response.status(status).json({
      statusCode: status,
      messages,
      data: null,
    });
  }
}
