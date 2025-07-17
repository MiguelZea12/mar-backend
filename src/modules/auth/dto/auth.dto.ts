import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para registro de usuario
 * Patrón: Data Transfer Object
 */
export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del cliente' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  nombre: string;

  @ApiProperty({ example: 'juan@email.com', description: 'Email del cliente' })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({ example: '123456789', description: 'Teléfono del cliente' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono?: string;

  @ApiProperty({ example: 'Calle 123, Ciudad', description: 'Dirección del cliente' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

/**
 * DTO para login de usuario
 */
export class LoginDto {
  @ApiProperty({ example: 'juan@email.com', description: 'Email del cliente' })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser texto' })
  password: string;
}

/**
 * DTO para respuesta de autenticación
 */
export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT' })
  access_token: string;

  @ApiProperty({ example: 'Bearer', description: 'Tipo de token' })
  token_type: string;

  @ApiProperty({ example: 3600, description: 'Tiempo de expiración en segundos' })
  expires_in: number;

  @ApiProperty({ description: 'Información del usuario autenticado' })
  user: {
    id: number;
    nombre: string;
    email: string;
  };
}
