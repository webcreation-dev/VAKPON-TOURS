import { IsString, IsNotEmpty, IsDateString, IsNumber, IsArray, IsOptional, Min, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  packId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsNumber()
  @Min(1)
  participantsCount: number;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  optionIds?: string[];
}
