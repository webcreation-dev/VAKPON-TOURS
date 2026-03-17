import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService);
    register(userData: Partial<User>): Promise<User>;
    login(email: string, pass: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../common/enums/user-role.enum").UserRole;
        };
    }>;
}
