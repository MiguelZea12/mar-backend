import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

/**
 * Entidad Cliente - Representa los clientes del sistema de catering
 * Patrón: Entity (parte del patrón Repository)
 */
@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 255 })
  direccion: string;

  @Column({ length: 100, nullable: true })
  empresa?: string;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación uno a muchos con pedidos
  @OneToMany('Order', 'cliente')
  pedidos: any[];
}
