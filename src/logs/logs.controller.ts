import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin/logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('email') email?: string,
    @Query('method') method?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.logsService.findAll({ userId, email, method, startDate, endDate });
  }
}
