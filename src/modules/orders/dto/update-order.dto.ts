import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../../entities';

/**
 * DTO para actualizar el estado de un pedido
 * Patrón: Data Transfer Object (DTO)
 */
export class UpdateOrderStatusDto {
  @ApiPropertyOptional({ 
    description: 'Nuevo estado del pedido', 
    enum: OrderStatus,
    example: OrderStatus.CONFIRMADO 
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  estado?: OrderStatus;
}
