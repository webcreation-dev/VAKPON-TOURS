import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/mail/mail.service';
import { UserRole } from '../src/common/enums/user-role.enum';
import { ReservationStatus } from '../src/common/enums/reservation-status.enum';

describe('Vakpon Tours (e2e)', () => {
  let app: INestApplication;
  let clientToken: string;
  let adminToken: string;
  let packId: string;
  let reservationId: string;
  
  const testEmail = `test-${Date.now()}@vakpon.com`;

  const mockMailService = {
    sendUserVerification: jest.fn().mockResolvedValue(true),
    sendAdminReservationNotification: jest.fn().mockResolvedValue(true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Flow', () => {
    it('should register and login', async () => {
      // 1. Register
      const regRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        });
      
      if (regRes.status !== 201) {
          require('fs').writeFileSync('test_debug.txt', JSON.stringify({ status: regRes.status, body: regRes.body }));
      }
      expect(regRes.status).toBe(201);

      // 2. Login Client
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: 'password123',
        });
      expect(loginRes.status).toBe(200);
      clientToken = loginRes.body.access_token;

      // 3. Login Admin
      const adminLoginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: process.env.ADMIN_EMAIL || 'adjibiadechinan@gmail.com',
          password: process.env.ADMIN_PASSWORD || 'admin1234',
        });
      expect(adminLoginRes.status).toBe(200);
      adminToken = adminLoginRes.body.access_token;
    });

    it('should create pack and reservation', async () => {
      // Admin create pack
      const packRes = await request(app.getHttpServer())
        .post('/packs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Aventure Cotonou',
          description: 'Découvrez la ville économique.',
          startingPrice: 500,
          durationDays: 3,
        });
      expect(packRes.status).toBe(201);
      packId = packRes.body.id;

      // Client create reservation
      const resRes = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          packId: packId,
          startDate: new Date().toISOString(),
          participantsCount: 2,
        });
      expect(resRes.status).toBe(201);
      reservationId = resRes.body.id;
    });

    it('should check logs', async () => {
      const logsRes = await request(app.getHttpServer())
        .get('/admin/logs')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(logsRes.status).toBe(200);
      expect(Array.isArray(logsRes.body)).toBe(true);
    });
  });
});
