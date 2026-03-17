import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(userData: Partial<User>): Promise<User>;
    login(loginData: {
        email: string;
        pass: string;
    }): Promise<{
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
