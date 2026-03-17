import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
export declare class MailService {
    private mailerService;
    private configService;
    constructor(mailerService: MailerService, configService: ConfigService);
    sendUserVerification(user: User, token: string): Promise<void>;
    sendAdminReservationNotification(reservation: any): Promise<void>;
}
