import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderItem, OrderStatus, MenuItem, Cliente } from '../../entities';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderNumberFactory } from './factories/order-number.factory';

/**
 * Interface para el patrón Observer
 */
export interface OrderObserver {
  onOrderStatusChanged(order: Order, oldStatus: OrderStatus, newStatus: OrderStatus): void;
}

/**
 * Servicio de Pedidos
 * Patrón: Repository Pattern
 * Patrón: Observer Pattern para notificaciones de cambio de estado
 * Patrón: Transaction Script para operaciones complejas
 */
@Injectable()
export class OrdersService {
  private observers: OrderObserver[] = [];

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly orderNumberFactory: OrderNumberFactory,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Agregar un observer
   */
  addObserver(observer: OrderObserver): void {
    this.observers.push(observer);
  }

  /**
   * Remover un observer
   */
  removeObserver(observer: OrderObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notificar a todos los observers sobre cambio de estado
   */
  private notifyObservers(order: Order, oldStatus: OrderStatus, newStatus: OrderStatus): void {
    this.observers.forEach(observer => {
      observer.onOrderStatusChanged(order, oldStatus, newStatus);
    });
  }

  /**
   * Crear un nuevo pedido con transacción
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.dataSource.transaction(async manager => {
      // Verificar que el cliente existe
      const cliente = await manager.findOne(Cliente, { where: { id: createOrderDto.clienteId } });
      if (!cliente) {
        throw new NotFoundException(`Cliente con ID ${createOrderDto.clienteId} no encontrado`);
      }

      // Verificar que todos los menu items existen y calcular totales
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const itemDto of createOrderDto.items) {
        const menuItem = await manager.findOne(MenuItem, { where: { id: itemDto.menuItemId } });
        if (!menuItem) {
          throw new NotFoundException(`Menu item con ID ${itemDto.menuItemId} no encontrado`);
        }
        if (!menuItem.disponible) {
          throw new BadRequestException(`Menu item "${menuItem.nombre}" no está disponible`);
        }

        const itemSubtotal = menuItem.precio * itemDto.cantidad;
        subtotal += itemSubtotal;

        orderItemsData.push({
          menuItemId: menuItem.id,
          cantidad: itemDto.cantidad,
          precioUnitario: menuItem.precio,
          subtotal: itemSubtotal,
          personalizaciones: itemDto.personalizaciones,
        });
      }

      // Calcular impuestos y total
      const impuesto = subtotal * 0.12; // 12% de impuesto
      const descuento = createOrderDto.descuento || 0;
      const total = subtotal + impuesto - descuento;

      // Crear el pedido
      const order = manager.create(Order, {
        numeroOrden: this.orderNumberFactory.generateOrderNumber(),
        clienteId: createOrderDto.clienteId,
        fechaEntrega: new Date(createOrderDto.fechaEntrega),
        horaEntrega: createOrderDto.horaEntrega,
        direccionEntrega: createOrderDto.direccionEntrega,
        notas: createOrderDto.notas,
        cantidadPersonas: createOrderDto.cantidadPersonas,
        subtotal,
        impuesto,
        descuento,
        total,
        estado: OrderStatus.PENDIENTE,
      });

      const savedOrder = await manager.save(order);

      // Crear los order items
      for (const itemData of orderItemsData) {
        const orderItem = manager.create(OrderItem, {
          menuItemId: itemData.menuItemId,
          cantidad: itemData.cantidad,
          precioUnitario: itemData.precioUnitario,
          subtotal: itemData.subtotal,
          personalizaciones: itemData.personalizaciones,
          orderId: savedOrder.id,
        });
        await manager.save(orderItem);
      }

      return savedOrder;
    });
  }

  /**
   * Obtener todos los pedidos con paginación y filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    estado?: OrderStatus,
    clienteId?: number,
    fechaDesde?: string,
    fechaHasta?: string,
  ) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.cliente', 'cliente')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.menuItem', 'menuItem');

    if (estado) {
      queryBuilder.andWhere('order.estado = :estado', { estado });
    }

    if (clienteId) {
      queryBuilder.andWhere('order.clienteId = :clienteId', { clienteId });
    }

    if (fechaDesde) {
      queryBuilder.andWhere('order.fechaEntrega >= :fechaDesde', { fechaDesde });
    }

    if (fechaHasta) {
      queryBuilder.andWhere('order.fechaEntrega <= :fechaHasta', { fechaHasta });
    }

    const [orders, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('order.createdAt', 'DESC')
      .getManyAndCount();

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un pedido por ID
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['cliente', 'orderItems', 'orderItems.menuItem', 'orderItems.menuItem.categoria'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return order;
  }

  /**
   * Actualizar el estado de un pedido
   */
  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    const oldStatus = order.estado;

    if (updateOrderStatusDto.estado) {
      order.estado = updateOrderStatusDto.estado;
      const updatedOrder = await this.orderRepository.save(order);
      
      // Notificar a los observers sobre el cambio de estado
      this.notifyObservers(updatedOrder, oldStatus, updateOrderStatusDto.estado);
      
      return updatedOrder;
    }

    return order;
  }

  /**
   * Cancelar un pedido
   */
  async cancel(id: number): Promise<Order> {
    const order = await this.findOne(id);
    
    if (order.estado === OrderStatus.ENTREGADO) {
      throw new BadRequestException('No se puede cancelar un pedido ya entregado');
    }

    const oldStatus = order.estado;
    order.estado = OrderStatus.CANCELADO;
    const updatedOrder = await this.orderRepository.save(order);
    
    this.notifyObservers(updatedOrder, oldStatus, OrderStatus.CANCELADO);
    
    return updatedOrder;
  }

  /**
   * Obtener estadísticas de pedidos
   */
  async getEstadisticas(fechaDesde?: string, fechaHasta?: string) {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (fechaDesde) {
      queryBuilder.andWhere('order.createdAt >= :fechaDesde', { fechaDesde });
    }

    if (fechaHasta) {
      queryBuilder.andWhere('order.createdAt <= :fechaHasta', { fechaHasta });
    }

    const totalPedidos = await queryBuilder.getCount();
    
    const estadisticasPorEstado = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.estado', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('order.estado')
      .getRawMany();

    const ingresosTotales = await queryBuilder
      .select('SUM(order.total)', 'total')
      .getRawOne();

    const pedidosPorDia = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.createdAt)', 'fecha')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('DATE(order.createdAt)')
      .orderBy('DATE(order.createdAt)', 'DESC')
      .limit(30)
      .getRawMany();

    // Menú más solicitado
    const menuMasSolicitado = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.menuItem', 'menuItem')
      .select('menuItem.nombre', 'nombre')
      .addSelect('SUM(orderItem.cantidad)', 'cantidadTotal')
      .groupBy('menuItem.id, menuItem.nombre')
      .orderBy('SUM(orderItem.cantidad)', 'DESC')
      .limit(1)
      .getRawOne();

    // Clientes recurrentes (más de 3 pedidos)
    const clientesRecurrentes = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.cliente', 'cliente')
      .select('cliente.nombre', 'nombre')
      .addSelect('cliente.apellido', 'apellido')
      .addSelect('COUNT(*)', 'cantidadPedidos')
      .groupBy('cliente.id, cliente.nombre, cliente.apellido')
      .having('COUNT(*) > 3')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany();

    return {
      totalPedidos,
      estadisticasPorEstado,
      ingresosTotales: parseFloat(ingresosTotales?.total || '0'),
      pedidosPorDia,
      menuMasSolicitado,
      clientesRecurrentes,
    };
  }
}
