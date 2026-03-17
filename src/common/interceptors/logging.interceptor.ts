import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogsService } from '../../logs/logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP_ACTION');

  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, ip, body } = request;

    if (user) {
      const now = Date.now();
      return next.handle().pipe(
        tap(async () => {
          const delay = Date.now() - now;
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;

          this.logger.log(
            `User: ${user.email} (ID: ${user.id}) | Method: ${method} | URL: ${url} | Status: ${statusCode} | Duration: ${delay}ms`,
          );

          // Save to Database
          try {
            await this.logsService.create({
              method,
              url,
              ip,
              duration: delay,
              statusCode,
              user,
              userEmail: user.email,
              payload: method !== 'GET' ? body : null, // Store payload for non-GET requests
            });
          } catch (error) {
            this.logger.error('Failed to save log to database', error);
          }
        }),
      );
    }

    return next.handle();
  }
}
