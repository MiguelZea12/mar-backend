import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto, UpdateClienteDto } from './dto';

/**
 * Controlador de Clientes
 * Patrón: MVC - Controller
 * Maneja las peticiones HTTP relacionadas con clientes
 */
@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 409, description: 'Email ya existe.' })
  create(@Body(ValidationPipe) createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes con paginación' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad por página', example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida exitosamente.' })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.clientesService.findAll(page, limit);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar clientes por criterios' })
  @ApiQuery({ name: 'nombre', required: false, description: 'Nombre o apellido del cliente' })
  @ApiQuery({ name: 'email', required: false, description: 'Email del cliente' })
  @ApiQuery({ name: 'telefono', required: false, description: 'Teléfono del cliente' })
  @ApiResponse({ status: 200, description: 'Clientes encontrados.' })
  buscar(
    @Query('nombre') nombre?: string,
    @Query('email') email?: string,
    @Query('telefono') telefono?: string,
  ) {
    return this.clientesService.buscar({ nombre, email, telefono });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Get(':id/historial-pedidos')
  @ApiOperation({ summary: 'Obtener historial de pedidos de un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Historial de pedidos obtenido.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  getHistorialPedidos(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.getHistorialPedidos(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @ApiResponse({ status: 409, description: 'Email ya existe.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cliente (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 204, description: 'Cliente eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }
}
