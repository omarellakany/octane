import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.transform(data);
      }),
    );
  }

  private transform(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.transform(item));
    }
    if (data !== null && typeof data === 'object') {
      const result = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const snakeKey = this.toSnakeCase(key);
          result[snakeKey] = this.transform(data[key]);
        }
      }
      return result;
    }
    return data;
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^_/, '');
  }
}
