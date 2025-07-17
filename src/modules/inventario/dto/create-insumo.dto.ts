import { IsString, IsNumber, IsOptional, IsDateString, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO para crear un nuevo insumo
 * Patrón: Data Transfer Object (DTO)
 */
export class CreateInsumoDto {
  @ApiProperty({ description: 'Nombre del insumo', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción del insumo' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Unidad de medida (kg, gr, lt, ml, unidad, etc.)', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  unidadMedida: string;

  @ApiProperty({ description: 'Cantidad actual en inventario' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  cantidadActual: number;

  @ApiProperty({ description: 'Cantidad mínima para alertas' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  cantidadMinima: number;

  @ApiProperty({ description: 'Costo unitario del insumo' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  costoUnitario: number;

  @ApiPropertyOptional({ description: 'Proveedor del insumo', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  proveedor?: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;
}
