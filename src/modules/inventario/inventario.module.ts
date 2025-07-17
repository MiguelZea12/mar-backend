import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insumo } from '../../entities';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { InventoryAlertService } from './services/inventory-alert.service';

/**
 * Módulo de Inventario
 * Patrón: Module Pattern
 */
@Module({
  imports: [TypeOrmModule.forFeature([Insumo])],
  controllers: [InventarioController],
  providers: [InventarioService, InventoryAlertService],
  exports: [InventarioService, InventoryAlertService],
})
export class InventarioModule {}
