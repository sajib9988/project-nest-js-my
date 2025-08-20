// src/common/interceptors/response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface ResponseFormat<T> {
  statusCode: number;
  messages: { message: string; property: string }[];
  data: T | null;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => {
        // If controller returns an object with message, accessToken, refreshToken, etc., include all
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          return {
            statusCode,
            messages: data?.messages || [],
            data: { ...data },
          };
        }
        // fallback for other types
        return {
          statusCode,
          messages: [],
          data,
        };
      }),
    );
  }
}
