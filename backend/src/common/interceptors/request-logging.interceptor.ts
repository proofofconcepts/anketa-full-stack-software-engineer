import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const requestId = req.header('x-request-id') ?? randomUUID();
    res.setHeader('x-request-id', requestId);

    return next.handle().pipe(
      tap({
        next: () => {
          const payload = {
            level: 'info',
            requestId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            latencyMs: Date.now() - startedAt,
            timestamp: new Date().toISOString(),
          };

          // Structured terminal logs that can be ingested by observability tools.
          console.log(JSON.stringify(payload));
        },
      }),
    );
  }
}
