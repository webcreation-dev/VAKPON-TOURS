import { User } from '../../users/entities/user.entity';
export declare class UserLog {
    id: string;
    method: string;
    url: string;
    ip: string;
    duration: number;
    payload: any;
    statusCode: number;
    user: User;
    userEmail: string;
    createdAt: Date;
}
