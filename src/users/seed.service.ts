import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      this.logger.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment. Skipping admin seeding.');
      return;
    }

    const existingAdmin = await this.usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
      this.logger.log(`Creating default admin user: ${adminEmail}`);
      try {
        await this.usersService.create({
          email: adminEmail,
          password: adminPassword,
          firstName: 'Vakpon',
          lastName: 'Admin',
          role: UserRole.ADMIN,
        });
        this.logger.log('Default admin user created successfully.');
      } catch (error) {
        this.logger.error('Failed to create default admin user', error);
      }
    } else {
      this.logger.log('Admin user already exists. Skipping seeding.');
    }
  }
}
