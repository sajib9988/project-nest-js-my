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
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          // 👇 এখানে টাইপ স্পষ্ট করে দেওয়া হলো
          let messages: { message: string; property: string }[] = [];

          if (data.message) {
            messages.push({
              message: data.message,
              property: 'success',
            });
          }

          return {
            statusCode,
            messages: data?.messages || messages,
            data: { ...data },
          };
        }

        return {
          statusCode,
          messages: [],
          data,
        };
      }),
    );
  }
}
