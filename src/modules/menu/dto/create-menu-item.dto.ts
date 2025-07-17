import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, MaxLength, MinLength, IsPositive, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO para crear un nuevo item del menú
 * Patrón: Data Transfer Object (DTO)
 */
export class CreateMenuItemDto {
  @ApiProperty({ description: 'Nombre del item del menú', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  nombre: string;

  @ApiProperty({ description: 'Descripción del item del menú' })
  @IsString()
  @MinLength(10)
  descripcion: string;

  @ApiProperty({ description: 'Precio del item', example: 25.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  precio: number;

  @ApiPropertyOptional({ description: 'URL de la imagen del item' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen?: string;

  @ApiPropertyOptional({ description: 'Disponibilidad del item', default: true })
  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @ApiPropertyOptional({ description: 'Tiempo de preparación en minutos', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  tiempoPreparacion?: number;

  @ApiPropertyOptional({ description: 'Lista de ingredientes', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredientes?: string[];

  @ApiPropertyOptional({ description: 'Lista de alérgenos', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alergenos?: string[];

  @ApiProperty({ description: 'ID de la categoría a la que pertenece' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  categoriaId: number;
}
