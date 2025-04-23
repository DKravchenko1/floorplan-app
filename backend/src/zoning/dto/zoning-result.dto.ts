import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ZoneDto {
  @IsNumber()
  roomId: number;

  @IsString()
  zone: string;
}

export class ZoningResultDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ZoneDto)
  zones: ZoneDto[];
}
