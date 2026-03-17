import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config/multer.config';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ReservationStatus } from '../common/enums/reservation-status.enum';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  create(@Body() createReservationDto: CreateReservationDto, @Req() req) {
    return this.reservationsService.create(createReservationDto, req.user);
  }

  @Get('my')
  @Roles(UserRole.CLIENT)
  findMyReservations(@Req() req) {
    return this.reservationsService.findAll(req.user.role, req.user.id);
  }

  @Get('admin')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  findAllAdmin() {
    return this.reservationsService.findAll('ADMIN');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    // Note: In a real app, we should check if the CLIENT owns this reservation
    return this.reservationsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
    @Body('internalNotes') internalNotes?: string,
  ) {
    return this.reservationsService.updateStatus(id, status, internalNotes);
  }

  @Patch(':id/upload-proof')
  @Roles(UserRole.CLIENT)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadProof(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.reservationsService.uploadProof(id, req.user.id, file.path);
  }
}
