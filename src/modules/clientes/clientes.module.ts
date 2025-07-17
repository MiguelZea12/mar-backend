import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../../entities/cliente.entity';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';

/**
 * Módulo de Clientes
 * Patrón: Module Pattern - Organiza componentes relacionados
 */
@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService], // Exportamos el servicio para uso en otros módulos
})
export class ClientesModule {}
