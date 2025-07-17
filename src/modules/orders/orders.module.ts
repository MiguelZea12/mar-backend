import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, MenuItem, Cliente } from '../../entities';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderNumberFactory } from './factories/order-number.factory';

/**
 * Módulo de Pedidos
 * Patrón: Module Pattern
 */
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, MenuItem, Cliente])],
  controllers: [OrdersController],
  providers: [OrdersService, OrderNumberFactory],
  exports: [OrdersService],
})
export class OrdersModule {}
