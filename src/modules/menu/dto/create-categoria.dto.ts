import { IsString, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para crear una nueva categoría
 * Patrón: Data Transfer Object (DTO)
 */
export class CreateCategoriaDto {
  @ApiProperty({ description: 'Nombre de la categoría', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción de la categoría' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado activo de la categoría', default: true })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
