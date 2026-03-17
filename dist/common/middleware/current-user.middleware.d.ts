import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class CurrentUserMiddleware implements NestMiddleware {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    use(req: any, res: any, next: () => void): void;
}
