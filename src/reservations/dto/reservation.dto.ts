import { IsString, IsNotEmpty, IsDateString, IsNumber, IsArray, IsOptional, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 'uuid-du-pack', description: 'ID du pack choisi' })
  @IsUUID()
  @IsNotEmpty()
  packId: string;

  @ApiProperty({ example: '2024-12-01', description: 'Date de début du voyage' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: 2, description: 'Nombre de participants' })
  @IsNumber()
  @Min(1)
  participantsCount: number;

  @ApiProperty({ example: ['uuid-option-1'], required: false, type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  optionIds?: string[];
}
