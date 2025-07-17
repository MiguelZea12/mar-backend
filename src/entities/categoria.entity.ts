import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Insumo } from './insumo.entity';

/**
 * Entidad Categoría - Representa las categorías de alimentos/menús
 * Patrón: Entity (parte del patrón Repository)
 */
@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ default: true })
  activa: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación uno a muchos con items del menú
  @OneToMany('MenuItem', 'categoria')
  menuItems: any[];

  @OneToMany(() => Insumo, insumo => insumo.categoria)
  insumos: Insumo[];
}
