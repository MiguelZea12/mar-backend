import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../../entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from './dto';

/**
 * Servicio de Clientes
 * Patrón: Repository Pattern - Encapsula la lógica de acceso a datos
 * Patrón: Service Layer - Encapsula la lógica de negocio
 */
@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  /**
   * Crear un nuevo cliente
   * @param createClienteDto Datos del cliente a crear
   * @returns Cliente creado
   */
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // Verificar si el email ya existe
    const existingCliente = await this.clienteRepository.findOne({
      where: { email: createClienteDto.email }
    });

    if (existingCliente) {
      throw new ConflictException('Ya existe un cliente con este email');
    }

    const cliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  /**
   * Obtener todos los clientes con paginación
   * @param page Página actual
   * @param limit Cantidad de registros por página
   * @returns Lista de clientes y metadatos de paginación
   */
  async findAll(page: number = 1, limit: number = 10) {
    const [clientes, total] = await this.clienteRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      clientes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un cliente por ID
   * @param id ID del cliente
   * @returns Cliente encontrado
   */
  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['pedidos'], // Incluir relación con pedidos
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  /**
   * Actualizar un cliente
   * @param id ID del cliente
   * @param updateClienteDto Datos a actualizar
   * @returns Cliente actualizado
   */
  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Si se está actualizando el email, verificar que no exista otro cliente con ese email
    if (updateClienteDto.email && updateClienteDto.email !== cliente.email) {
      const existingCliente = await this.clienteRepository.findOne({
        where: { email: updateClienteDto.email }
      });

      if (existingCliente) {
        throw new ConflictException('Ya existe un cliente con este email');
      }
    }

    Object.assign(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  /**
   * Eliminar un cliente (soft delete)
   * @param id ID del cliente
   */
  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    cliente.activo = false;
    await this.clienteRepository.save(cliente);
  }

  /**
   * Obtener historial de pedidos de un cliente
   * @param clienteId ID del cliente
   * @returns Lista de pedidos del cliente
   */
  async getHistorialPedidos(clienteId: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id: clienteId },
      relations: ['pedidos', 'pedidos.orderItems', 'pedidos.orderItems.menuItem'],
      order: {
        pedidos: { createdAt: 'DESC' }
      }
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    return cliente.pedidos;
  }

  /**
   * Buscar clientes por criterios
   * @param criterios Criterios de búsqueda
   * @returns Lista de clientes que coinciden
   */
  async buscar(criterios: { nombre?: string; email?: string; telefono?: string }) {
    const queryBuilder = this.clienteRepository.createQueryBuilder('cliente');

    if (criterios.nombre) {
      queryBuilder.andWhere(
        '(cliente.nombre ILIKE :nombre OR cliente.apellido ILIKE :nombre)',
        { nombre: `%${criterios.nombre}%` }
      );
    }

    if (criterios.email) {
      queryBuilder.andWhere('cliente.email ILIKE :email', { email: `%${criterios.email}%` });
    }

    if (criterios.telefono) {
      queryBuilder.andWhere('cliente.telefono ILIKE :telefono', { telefono: `%${criterios.telefono}%` });
    }

    return await queryBuilder.getMany();
  }
}
