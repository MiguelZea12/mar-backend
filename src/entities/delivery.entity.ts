import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

export enum DeliveryStatus {
  PROGRAMADA = 'programada',
  EN_RUTA = 'en_ruta',
  ENTREGADA = 'entregada',
  FALLIDA = 'fallida'
}

/**
 * Entidad Delivery - Representa las entregas de pedidos
 * Patrón: Entity (parte del patrón Repository)
 */
@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaProgramada: Date;

  @Column({ type: 'time' })
  horaProgramada: string;

  @Column({ type: 'timestamp', nullable: true })
  fechaEntregaReal?: Date;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PROGRAMADA
  })
  estado: DeliveryStatus;

  @Column({ length: 255 })
  direccion: string;

  @Column({ length: 100, nullable: true })
  contactoEntrega?: string;

  @Column({ length: 20, nullable: true })
  telefonoContacto?: string;

  @Column({ length: 100, nullable: true })
  repartidor?: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relación muchos a uno con order
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;
}
