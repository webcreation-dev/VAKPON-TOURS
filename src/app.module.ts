import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Pack } from './packs/entities/pack.entity';
import { PackOption } from './packs/entities/pack-option.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { UsersModule } from './users/users.module';
import { PacksModule } from './packs/packs.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CurrentUserMiddleware } from './common/middleware/current-user.middleware';
import { JwtModule } from '@nestjs/jwt';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Pack, PackOption, Reservation],
        autoLoadEntities: true,
        synchronize: true, // Désactiver en production
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
      }),
    }),
    UsersModule,
    PacksModule,
    ReservationsModule,
    AuthModule,
    MailModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
