import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Pack } from '../packs/entities/pack.entity';
import { PackOption } from '../packs/entities/pack-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Pack, PackOption])],
  providers: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
