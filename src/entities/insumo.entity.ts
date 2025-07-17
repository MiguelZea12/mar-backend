import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from './categoria.entity';

/**
 * Entidad Insumo - Representa los insumos del inventario
 * Patrón: Entity (parte del patrón Repository)
 */
@Entity('insumos')
export class Insumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ length: 20 })
  unidadMedida: string; // kg, gr, lt, ml, unidad, etc.

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidadActual: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidadMinima: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costoUnitario: number;

  @Column({ length: 100, nullable: true })
  proveedor?: string;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento?: Date;

  @Column({ default: true })
  activo: boolean;

  @Column({ name: 'categoriaId', type: 'int' })
  categoriaId: number;

  @ManyToOne(() => Categoria, categoria => categoria.insumos, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoriaId' })
  categoria: Categoria;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
