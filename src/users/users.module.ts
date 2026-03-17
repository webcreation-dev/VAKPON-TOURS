import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, SeedService],
  controllers: [UsersController],
  exports: [UsersService], // Need to export for Auth
})
export class UsersModule {}
