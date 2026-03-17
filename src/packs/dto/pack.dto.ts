import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackDto {
  @ApiProperty({ example: 'Aventure Cotonou', description: 'Le titre du pack' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Découvrez la ville économique.', description: 'Description détaillée' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 500, description: 'Prix de départ' })
  @IsNumber()
  @Min(0)
  startingPrice: number;

  @ApiProperty({ example: 3, description: 'Durée en jours' })
  @IsNumber()
  @Min(1)
  durationDays: number;

  @ApiProperty({ example: ['Transport', 'Hébergement'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includedServices?: string[];

  @ApiProperty({ example: true, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class CreatePackOptionDto {
  @ApiProperty({ example: 'Guide Privé' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'Un guide dédié pour votre groupe', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  price: number;
}
