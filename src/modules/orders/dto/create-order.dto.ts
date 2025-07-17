import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsPositive, IsDateString, Matches, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO para un item del pedido
 */
export class OrderItemDto {
  @ApiProperty({ description: 'ID del item del menú' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  menuItemId: number;

  @ApiProperty({ description: 'Cantidad del item' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  cantidad: number;

  @ApiPropertyOptional({ description: 'Personalizaciones del item' })
  @IsOptional()
  @IsString()
  personalizaciones?: string;
}

/**
 * DTO para crear un nuevo pedido
 * Patrón: Data Transfer Object (DTO)
 */
export class CreateOrderDto {
  @ApiProperty({ description: 'ID del cliente' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  clienteId: number;

  @ApiProperty({ description: 'Fecha de entrega (YYYY-MM-DD)' })
  @IsDateString()
  fechaEntrega: string;

  @ApiProperty({ description: 'Hora de entrega (HH:MM)', example: '14:30' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora debe estar en formato HH:MM' })
  horaEntrega: string;

  @ApiProperty({ description: 'Dirección de entrega' })
  @IsString()
  @MinLength(10)
  direccionEntrega: string;

  @ApiPropertyOptional({ description: 'Notas adicionales sobre el pedido' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({ description: 'Cantidad de personas para el catering' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  cantidadPersonas: number;

  @ApiPropertyOptional({ description: 'Descuento aplicado', default: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  descuento?: number;

  @ApiProperty({ description: 'Items del pedido', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
