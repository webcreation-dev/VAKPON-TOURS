import { Module } from '@nestjs/common';
import { PacksService } from './packs.service';
import { PacksController } from './packs.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Pack } from './entities/pack.entity';
import { PackOption } from './entities/pack-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pack, PackOption])],
  providers: [PacksService],
  controllers: [PacksController],
})
export class PacksModule {}
