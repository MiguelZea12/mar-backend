import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Insumo } from '../../entities';
import { CreateInsumoDto, UpdateInsumoDto, UpdateStockDto } from './dto';
import { InventoryAlertService } from './services/inventory-alert.service';

/**
 * Servicio de Inventario
 * Patrón: Repository Pattern
 * Patrón: Service Layer
 */
@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,
    private readonly inventoryAlertService: InventoryAlertService,
  ) {}

  /**
   * Crear un nuevo insumo
   */
  async create(createInsumoDto: CreateInsumoDto): Promise<Insumo> {
    const existingInsumo = await this.insumoRepository.findOne({
      where: { nombre: createInsumoDto.nombre }
    });

    if (existingInsumo) {
      throw new ConflictException('Ya existe un insumo con este nombre');
    }

    const insumo = this.insumoRepository.create({
      ...createInsumoDto,
      fechaVencimiento: createInsumoDto.fechaVencimiento 
        ? new Date(createInsumoDto.fechaVencimiento) 
        : undefined
    });

    const savedInsumo = await this.insumoRepository.save(insumo);

    // Verificar si el stock inicial está bajo
    if (savedInsumo.cantidadActual <= savedInsumo.cantidadMinima) {
      this.inventoryAlertService.notifyLowStock(savedInsumo);
    }

    return savedInsumo;
  }

  /**
   * Obtener todos los insumos con paginación
   */
  async findAll(page: number = 1, limit: number = 10) {
    const [insumos, total] = await this.insumoRepository.findAndCount({
      where: { activo: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { nombre: 'ASC' },
    });

    return {
      insumos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un insumo por ID
   */
  async findOne(id: number): Promise<Insumo> {
    const insumo = await this.insumoRepository.findOne({
      where: { id, activo: true }
    });

    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado`);
    }

    return insumo;
  }

  /**
   * Actualizar un insumo
   */
  async update(id: number, updateInsumoDto: UpdateInsumoDto): Promise<Insumo> {
    const insumo = await this.findOne(id);

    if (updateInsumoDto.nombre && updateInsumoDto.nombre !== insumo.nombre) {
      const existingInsumo = await this.insumoRepository.findOne({
        where: { nombre: updateInsumoDto.nombre }
      });

      if (existingInsumo) {
        throw new ConflictException('Ya existe un insumo con este nombre');
      }
    }

    Object.assign(insumo, {
      ...updateInsumoDto,
      fechaVencimiento: updateInsumoDto.fechaVencimiento 
        ? new Date(updateInsumoDto.fechaVencimiento) 
        : insumo.fechaVencimiento
    });

    const updatedInsumo = await this.insumoRepository.save(insumo);

    // Verificar alertas después de la actualización
    if (updatedInsumo.cantidadActual <= updatedInsumo.cantidadMinima) {
      this.inventoryAlertService.notifyLowStock(updatedInsumo);
    }

    return updatedInsumo;
  }

  /**
   * Actualizar solo el stock de un insumo
   */
  async updateStock(id: number, updateStockDto: UpdateStockDto): Promise<Insumo> {
    const insumo = await this.findOne(id);
    insumo.cantidadActual = updateStockDto.cantidadActual;
    
    const updatedInsumo = await this.insumoRepository.save(insumo);

    // Verificar alertas de stock bajo
    if (updatedInsumo.cantidadActual <= updatedInsumo.cantidadMinima) {
      this.inventoryAlertService.notifyLowStock(updatedInsumo);
    }

    return updatedInsumo;
  }

  /**
   * Eliminar un insumo (soft delete)
   */
  async remove(id: number): Promise<void> {
    const insumo = await this.findOne(id);
    insumo.activo = false;
    await this.insumoRepository.save(insumo);
  }

  /**
   * Obtener insumos con stock bajo
   */
  async getStockBajo(): Promise<Insumo[]> {
    return await this.insumoRepository
      .createQueryBuilder('insumo')
      .where('insumo.activo = :activo', { activo: true })
      .andWhere('insumo.cantidadActual <= insumo.cantidadMinima')
      .orderBy('insumo.cantidadActual', 'ASC')
      .getMany();
  }

  /**
   * Obtener insumos próximos a vencer
   */
  async getProximosAVencer(diasAdelante: number = 30): Promise<Insumo[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + diasAdelante);

    return await this.insumoRepository.find({
      where: {
        activo: true,
        fechaVencimiento: LessThan(fechaLimite)
      },
      order: { fechaVencimiento: 'ASC' }
    });
  }

  /**
   * Buscar insumos por criterios
   */
  async buscar(criterios: { 
    nombre?: string; 
    proveedor?: string; 
    unidadMedida?: string;
    stockBajo?: boolean;
  }) {
    const queryBuilder = this.insumoRepository
      .createQueryBuilder('insumo')
      .where('insumo.activo = :activo', { activo: true });

    if (criterios.nombre) {
      queryBuilder.andWhere('insumo.nombre ILIKE :nombre', { nombre: `%${criterios.nombre}%` });
    }

    if (criterios.proveedor) {
      queryBuilder.andWhere('insumo.proveedor ILIKE :proveedor', { proveedor: `%${criterios.proveedor}%` });
    }

    if (criterios.unidadMedida) {
      queryBuilder.andWhere('insumo.unidadMedida = :unidadMedida', { unidadMedida: criterios.unidadMedida });
    }

    if (criterios.stockBajo) {
      queryBuilder.andWhere('insumo.cantidadActual <= insumo.cantidadMinima');
    }

    return await queryBuilder.orderBy('insumo.nombre', 'ASC').getMany();
  }

  /**
   * Obtener estadísticas del inventario
   */
  async getEstadisticas() {
    const totalInsumos = await this.insumoRepository.count({ where: { activo: true } });
    
    const stockBajo = await this.getStockBajo();
    const proximosAVencer = await this.getProximosAVencer();
    
    const valorTotalInventario = await this.insumoRepository
      .createQueryBuilder('insumo')
      .select('SUM(insumo.cantidadActual * insumo.costoUnitario)', 'total')
      .where('insumo.activo = :activo', { activo: true })
      .getRawOne();

    const insumosAgotados = await this.insumoRepository.count({
      where: { activo: true, cantidadActual: 0 }
    });

    // Insumos por unidad de medida
    const insumosPorUnidad = await this.insumoRepository
      .createQueryBuilder('insumo')
      .select('insumo.unidadMedida', 'unidad')
      .addSelect('COUNT(*)', 'cantidad')
      .where('insumo.activo = :activo', { activo: true })
      .groupBy('insumo.unidadMedida')
      .getRawMany();

    return {
      totalInsumos,
      stockBajo: stockBajo.length,
      proximosAVencer: proximosAVencer.length,
      insumosAgotados,
      valorTotalInventario: parseFloat(valorTotalInventario?.total || '0'),
      insumosPorUnidad,
      alertas: {
        stockBajo,
        proximosAVencer
      }
    };
  }

  /**
   * Verificar y enviar alertas automáticas
   */
  async verificarAlertas(): Promise<void> {
    const stockBajo = await this.getStockBajo();
    const proximosAVencer = await this.getProximosAVencer();

    // Notificar stock bajo individualmente
    stockBajo.forEach(insumo => {
      this.inventoryAlertService.notifyLowStock(insumo);
    });

    // Notificar productos próximos a vencer en grupo
    if (proximosAVencer.length > 0) {
      this.inventoryAlertService.notifyExpiringSoon(proximosAVencer);
    }
  }
}
