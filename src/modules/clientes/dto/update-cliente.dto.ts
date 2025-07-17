import { PartialType } from '@nestjs/swagger';
import { CreateClienteDto } from './create-cliente.dto';

/**
 * DTO para actualizar un cliente existente
 * Patrón: Data Transfer Object (DTO)
 * Extiende de CreateClienteDto pero hace todos los campos opcionales
 */
export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
