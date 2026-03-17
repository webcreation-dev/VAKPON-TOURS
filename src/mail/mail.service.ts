import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserVerification(user: User, token: string) {
    const url = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/auth/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenue chez Vakpon Tours ! Vérifiez votre compte',
      template: './verification',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    });
  }

  async sendAdminReservationNotification(reservation: any) {
    const adminEmail = this.configService.get('ADMIN_EMAIL');

    await this.mailerService.sendMail({
      to: adminEmail,
      subject: `Nouvelle Réservation: ${reservation.reference}`,
      template: './admin-reservation-notification',
      context: {
        reference: reservation.reference,
        customerName: `${reservation.user.firstName} ${reservation.user.lastName}`,
        customerEmail: reservation.user.email,
        packTitle: reservation.pack.title,
        startDate: reservation.startDate,
        totalPrice: reservation.totalPrice,
      },
    });
  }
}
