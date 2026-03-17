import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PacksService } from './packs.service';
import { CreatePackDto, CreatePackOptionDto } from './dto/pack.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Packs')
@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  findAll() {
    return this.packsService.findAll(true);
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: 'Liste tous les packs (incluant les non-publiés) - Admin only' })
  findAllAdmin() {
    return this.packsService.findAll(false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un pack par son ID' })
  findOne(@Param('id') id: string) {
    return this.packsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau pack - Admin only' })
  create(@Body() createPackDto: CreatePackDto) {
    return this.packsService.create(createPackDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Modifier un pack - Admin only' })
  update(@Param('id') id: string, @Body() updatePackDto: CreatePackDto) { // Changed Partial to DTO for Swagger
    return this.packsService.update(id, updatePackDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer un pack - Admin only' })
  remove(@Param('id') id: string) {
    return this.packsService.delete(id);
  }

  // --- Options Routes ---

  @Post(':id/options')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Ajouter une option à un pack - Admin only' })
  addOption(@Param('id') packId: string, @Body() createOptionDto: CreatePackOptionDto) {
    return this.packsService.addOption(packId, createOptionDto);
  }

  @Delete('options/:optionId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer une option - Admin only' })
  removeOption(@Param('optionId') optionId: string) {
    return this.packsService.removeOption(optionId);
  }
}
