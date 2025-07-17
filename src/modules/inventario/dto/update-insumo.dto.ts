import { PartialType } from '@nestjs/swagger';
import { CreateInsumoDto } from './create-insumo.dto';
import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateInsumoDto extends PartialType(CreateInsumoDto) {}

/**
 * DTO para actualizar el stock de un insumo
 */
export class UpdateStockDto {
  @ApiProperty({ description: 'Nueva cantidad en stock' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  cantidadActual: number;
}
