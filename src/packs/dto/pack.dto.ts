import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';

export class CreatePackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  startingPrice: number;

  @IsNumber()
  @Min(1)
  durationDays: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includedServices?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class CreatePackOptionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;
}
