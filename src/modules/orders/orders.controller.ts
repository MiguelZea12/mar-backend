import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderStatus } from '../../entities';

/**
 * Controlador de Pedidos
 * Patrón: MVC - Controller
 */
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o menu item no disponible.' })
  @ApiResponse({ status: 404, description: 'Cliente o menu item no encontrado.' })
  create(@Body(ValidationPipe) createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pedidos con filtros' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad por página' })
  @ApiQuery({ name: 'estado', required: false, enum: OrderStatus, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'clienteId', required: false, description: 'Filtrar por cliente' })
  @ApiQuery({ name: 'fechaDesde', required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaHasta', required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('estado') estado?: OrderStatus,
    @Query('clienteId', new ParseIntPipe({ optional: true })) clienteId?: number,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    return this.ordersService.findAll(page, limit, estado, clienteId, fechaDesde, fechaHasta);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de pedidos' })
  @ApiQuery({ name: 'fechaDesde', required: false, description: 'Fecha desde para estadísticas' })
  @ApiQuery({ name: 'fechaHasta', required: false, description: 'Fecha hasta para estadísticas' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente.' })
  getEstadisticas(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    return this.ordersService.getEstadisticas(fechaDesde, fechaHasta);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiParam({ name: 'id', description: 'ID del pedido' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado.' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de un pedido' })
  @ApiParam({ name: 'id', description: 'ID del pedido' })
  @ApiResponse({ status: 200, description: 'Estado del pedido actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar un pedido' })
  @ApiParam({ name: 'id', description: 'ID del pedido' })
  @ApiResponse({ status: 200, description: 'Pedido cancelado exitosamente.' })
  @ApiResponse({ status: 400, description: 'No se puede cancelar el pedido.' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado.' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancel(id);
  }
}
