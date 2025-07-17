import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

export enum OrderStatus {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  PREPARANDO = 'preparando',
  LISTO = 'listo',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado'
}

/**
 * Entidad Order - Representa los pedidos de catering
 * Patrón: Entity (parte del patrón Repository)
 */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  numeroOrden: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDIENTE
  })
  estado: OrderStatus;

  @Column({ type: 'date' })
  fechaEntrega: Date;

  @Column({ type: 'time' })
  horaEntrega: string;

  @Column({ length: 255 })
  direccionEntrega: string;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  impuesto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'int' })
  cantidadPersonas: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación muchos a uno con cliente
  @ManyToOne(() => Cliente, cliente => cliente.pedidos)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column()
  clienteId: number;

  // Relación uno a muchos con order items
  @OneToMany('OrderItem', 'order')
  orderItems: any[];
}
