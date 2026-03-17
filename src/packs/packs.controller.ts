import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PacksService } from './packs.service';
import { CreatePackDto, CreatePackOptionDto } from './dto/pack.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  findAll() {
    return this.packsService.findAll(true);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  findAllAdmin() {
    return this.packsService.findAll(false);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createPackDto: CreatePackDto) {
    return this.packsService.create(createPackDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updatePackDto: Partial<CreatePackDto>) {
    return this.packsService.update(id, updatePackDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.packsService.delete(id);
  }

  // --- Options Routes ---

  @Post(':id/options')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  addOption(@Param('id') packId: string, @Body() createOptionDto: CreatePackOptionDto) {
    return this.packsService.addOption(packId, createOptionDto);
  }

  @Delete('options/:optionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  removeOption(@Param('optionId') optionId: string) {
    return this.packsService.removeOption(optionId);
  }
}
