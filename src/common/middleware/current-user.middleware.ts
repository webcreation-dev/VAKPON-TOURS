import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET') || 'secret',
        });
        req.user = payload; // Attach user to request
      } catch (e) {
        // Token invalid or expired, just continue without user
      }
    }
    next();
  }
}
