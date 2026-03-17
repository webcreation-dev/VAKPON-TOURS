import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller('admin/logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer et filtrer les logs d\'audit - Admin only' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'method', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: 'Format YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Format YYYY-MM-DD' })
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
