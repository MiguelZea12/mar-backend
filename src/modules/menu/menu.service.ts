import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria, MenuItem } from '../../entities';
import { CreateCategoriaDto, CreateMenuItemDto, UpdateCategoriaDto, UpdateMenuItemDto } from './dto';

/**
 * Servicio de Menú
 * Patrón: Repository Pattern - Encapsula la lógica de acceso a datos
 * Patrón: Service Layer - Encapsula la lógica de negocio
 */
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  // =============== CATEGORÍAS ===============

  /**
   * Crear una nueva categoría
   */
  async createCategoria(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    const existingCategoria = await this.categoriaRepository.findOne({
      where: { nombre: createCategoriaDto.nombre }
    });

    if (existingCategoria) {
      throw new ConflictException('Ya existe una categoría con este nombre');
    }

    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  /**
   * Obtener todas las categorías
   */
  async findAllCategorias(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      where: { activa: true },
      relations: ['menuItems'],
      order: { nombre: 'ASC' },
    });
  }

  /**
   * Obtener una categoría por ID
   */
  async findOneCategoria(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  /**
   * Actualizar una categoría
   */
  async updateCategoria(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOneCategoria(id);

    if (updateCategoriaDto.nombre && updateCategoriaDto.nombre !== categoria.nombre) {
      const existingCategoria = await this.categoriaRepository.findOne({
        where: { nombre: updateCategoriaDto.nombre }
      });

      if (existingCategoria) {
        throw new ConflictException('Ya existe una categoría con este nombre');
      }
    }

    Object.assign(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  /**
   * Eliminar una categoría
   */
  async removeCategoria(id: number): Promise<void> {
    const categoria = await this.findOneCategoria(id);
    categoria.activa = false;
    await this.categoriaRepository.save(categoria);
  }

  // =============== MENU ITEMS ===============

  /**
   * Crear un nuevo item del menú
   */
  async createMenuItem(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    // Verificar que la categoría existe
    await this.findOneCategoria(createMenuItemDto.categoriaId);

    const menuItem = this.menuItemRepository.create(createMenuItemDto);
    return await this.menuItemRepository.save(menuItem);
  }

  /**
   * Obtener todos los items del menú con paginación
   */
  async findAllMenuItems(page: number = 1, limit: number = 10, categoriaId?: number) {
    const queryBuilder = this.menuItemRepository
      .createQueryBuilder('menuItem')
      .leftJoinAndSelect('menuItem.categoria', 'categoria')
      .where('menuItem.disponible = :disponible', { disponible: true });

    if (categoriaId) {
      queryBuilder.andWhere('menuItem.categoriaId = :categoriaId', { categoriaId });
    }

    const [menuItems, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('menuItem.nombre', 'ASC')
      .getManyAndCount();

    return {
      menuItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un item del menú por ID
   */
  async findOneMenuItem(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });

    if (!menuItem) {
      throw new NotFoundException(`Item del menú con ID ${id} no encontrado`);
    }

    return menuItem;
  }

  /**
   * Actualizar un item del menú
   */
  async updateMenuItem(id: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    const menuItem = await this.findOneMenuItem(id);

    if (updateMenuItemDto.categoriaId) {
      await this.findOneCategoria(updateMenuItemDto.categoriaId);
    }

    Object.assign(menuItem, updateMenuItemDto);
    return await this.menuItemRepository.save(menuItem);
  }

  /**
   * Eliminar un item del menú
   */
  async removeMenuItem(id: number): Promise<void> {
    const menuItem = await this.findOneMenuItem(id);
    menuItem.disponible = false;
    await this.menuItemRepository.save(menuItem);
  }

  // =============== BÚSQUEDAS ===============

  /**
   * Buscar items del menú por criterios
   * Implementa el patrón Strategy para diferentes tipos de búsqueda
   */
  async buscarMenuItems(criterios: {
    nombre?: string;
    categoriaId?: number;
    precioMin?: number;
    precioMax?: number;
    ingredientes?: string[];
    sinAlergenos?: string[];
  }) {
    const queryBuilder = this.menuItemRepository
      .createQueryBuilder('menuItem')
      .leftJoinAndSelect('menuItem.categoria', 'categoria')
      .where('menuItem.disponible = :disponible', { disponible: true });

    // Strategy: Búsqueda por nombre
    if (criterios.nombre) {
      queryBuilder.andWhere('menuItem.nombre ILIKE :nombre', { nombre: `%${criterios.nombre}%` });
    }

    // Strategy: Filtro por categoría
    if (criterios.categoriaId) {
      queryBuilder.andWhere('menuItem.categoriaId = :categoriaId', { categoriaId: criterios.categoriaId });
    }

    // Strategy: Filtro por rango de precios
    if (criterios.precioMin) {
      queryBuilder.andWhere('menuItem.precio >= :precioMin', { precioMin: criterios.precioMin });
    }

    if (criterios.precioMax) {
      queryBuilder.andWhere('menuItem.precio <= :precioMax', { precioMax: criterios.precioMax });
    }

    // Strategy: Filtro por ingredientes
    if (criterios.ingredientes && criterios.ingredientes.length > 0) {
      criterios.ingredientes.forEach((ingrediente, index) => {
        queryBuilder.andWhere(`menuItem.ingredientes ILIKE :ingrediente${index}`, {
          [`ingrediente${index}`]: `%${ingrediente}%`
        });
      });
    }

    // Strategy: Filtro sin alérgenos específicos
    if (criterios.sinAlergenos && criterios.sinAlergenos.length > 0) {
      criterios.sinAlergenos.forEach((alergeno, index) => {
        queryBuilder.andWhere(`(menuItem.alergenos IS NULL OR menuItem.alergenos NOT ILIKE :alergeno${index})`, {
          [`alergeno${index}`]: `%${alergeno}%`
        });
      });
    }

    return await queryBuilder.orderBy('menuItem.nombre', 'ASC').getMany();
  }

  /**
   * Obtener catálogo completo organizado por categorías
   */
  async getCatalogoCompleto() {
    const categorias = await this.categoriaRepository.find({
      where: { activa: true },
      relations: ['menuItems'],
      order: { nombre: 'ASC' },
    });

    return categorias.map(categoria => ({
      ...categoria,
      menuItems: categoria.menuItems.filter(item => item.disponible)
    }));
  }

  /**
   * Obtener estadísticas del menú
   */
  async getEstadisticasMenu() {
    const totalCategorias = await this.categoriaRepository.count({ where: { activa: true } });
    const totalItems = await this.menuItemRepository.count({ where: { disponible: true } });
    
    const precioPromedio = await this.menuItemRepository
      .createQueryBuilder('menuItem')
      .select('AVG(menuItem.precio)', 'promedio')
      .where('menuItem.disponible = :disponible', { disponible: true })
      .getRawOne();

    const itemMasCaro = await this.menuItemRepository.findOne({
      where: { disponible: true },
      order: { precio: 'DESC' },
      relations: ['categoria']
    });

    const itemMasBarato = await this.menuItemRepository.findOne({
      where: { disponible: true },
      order: { precio: 'ASC' },
      relations: ['categoria']
    });

    return {
      totalCategorias,
      totalItems,
      precioPromedio: parseFloat(precioPromedio?.promedio || '0'),
      itemMasCaro,
      itemMasBarato,
    };
  }
}
