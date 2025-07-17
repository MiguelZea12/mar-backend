import { IsString, IsEmail, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para crear un nuevo cliente
 * Patrón: Data Transfer Object (DTO)
 */
export class CreateClienteDto {
  @ApiProperty({ description: 'Nombre del cliente', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  nombre: string;

  @ApiProperty({ description: 'Apellido del cliente', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  apellido: string;

  @ApiProperty({ description: 'Email del cliente', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: 'Teléfono del cliente', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  telefono: string;

  @ApiProperty({ description: 'Dirección del cliente', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  direccion: string;

  @ApiPropertyOptional({ description: 'Empresa del cliente', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  empresa?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales sobre el cliente' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ description: 'Estado activo del cliente', default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
