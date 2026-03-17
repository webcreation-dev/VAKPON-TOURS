import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserLog } from './entities/log.entity';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([UserLog])],
  providers: [
    LogsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [LogsController],
  exports: [LogsService],
})
export class LogsModule {}
