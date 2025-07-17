import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { MenuItem } from './menu-item.entity';

/**
 * Entidad OrderItem - Representa los elementos individuales de un pedido
 * Patrón: Entity (parte del patrón Repository)
 */
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'text', nullable: true })
  personalizaciones?: string;

  // Relación muchos a uno con order
  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;

  // Relación muchos a uno con menu item
  @ManyToOne(() => MenuItem, menuItem => menuItem.orderItems)
  @JoinColumn({ name: 'menuItemId' })
  menuItem: MenuItem;

  @Column()
  menuItemId: number;
}
