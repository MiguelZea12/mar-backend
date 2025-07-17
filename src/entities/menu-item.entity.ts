import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Categoria } from './categoria.entity';

/**
 * Entidad MenuItem - Representa los elementos del menú/catálogo
 * Patrón: Entity (parte del patrón Repository)
 */
@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ length: 255, nullable: true })
  imagen?: string;

  @Column({ default: true })
  disponible: boolean;

  @Column({ type: 'int', default: 0 })
  tiempoPreparacion: number; // en minutos

  @Column({ type: 'simple-array', nullable: true })
  ingredientes?: string[];

  @Column({ type: 'simple-array', nullable: true })
  alergenos?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación muchos a uno con categoría
  @ManyToOne(() => Categoria, categoria => categoria.menuItems)
  @JoinColumn({ name: 'categoriaId' })
  categoria: Categoria;

  @Column()
  categoriaId: number;

  // Relación uno a muchos con order items
  @OneToMany('OrderItem', 'menuItem')
  orderItems: any[];
}
