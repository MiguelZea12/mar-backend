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
import { InventarioService } from './inventario.service';
import { CreateInsumoDto, UpdateInsumoDto, UpdateStockDto } from './dto';

/**
 * Controlador de Inventario
 * Patrón: MVC - Controller
 */
@ApiTags('inventario')
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo insumo' })
  @ApiResponse({ status: 201, description: 'Insumo creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'Ya existe un insumo con este nombre.' })
  create(@Body(ValidationPipe) createInsumoDto: CreateInsumoDto) {
    return this.inventarioService.create(createInsumoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los insumos' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad por página' })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.inventarioService.findAll(page, limit);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar insumos por criterios' })
  @ApiQuery({ name: 'nombre', required: false, description: 'Nombre del insumo' })
  @ApiQuery({ name: 'proveedor', required: false, description: 'Proveedor del insumo' })
  @ApiQuery({ name: 'unidadMedida', required: false, description: 'Unidad de medida' })
  @ApiQuery({ name: 'stockBajo', required: false, description: 'Solo insumos con stock bajo' })
  buscar(
    @Query('nombre') nombre?: string,
    @Query('proveedor') proveedor?: string,
    @Query('unidadMedida') unidadMedida?: string,
    @Query('stockBajo') stockBajo?: boolean,
  ) {
    return this.inventarioService.buscar({
      nombre,
      proveedor,
      unidadMedida,
      stockBajo: stockBajo === true || (stockBajo as any) === 'true'
    });
  }

  @Get('stock-bajo')
  @ApiOperation({ summary: 'Obtener insumos con stock bajo' })
  @ApiResponse({ status: 200, description: 'Lista de insumos con stock bajo.' })
  getStockBajo() {
    return this.inventarioService.getStockBajo();
  }

  @Get('proximos-vencer')
  @ApiOperation({ summary: 'Obtener insumos próximos a vencer' })
  @ApiQuery({ name: 'dias', required: false, description: 'Días hacia adelante (default: 30)' })
  @ApiResponse({ status: 200, description: 'Lista de insumos próximos a vencer.' })
  getProximosAVencer(
    @Query('dias', new ParseIntPipe({ optional: true })) dias: number = 30,
  ) {
    return this.inventarioService.getProximosAVencer(dias);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas del inventario' })
  @ApiResponse({ status: 200, description: 'Estadísticas del inventario obtenidas exitosamente.' })
  getEstadisticas() {
    return this.inventarioService.getEstadisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un insumo por ID' })
  @ApiParam({ name: 'id', description: 'ID del insumo' })
  @ApiResponse({ status: 200, description: 'Insumo encontrado.' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un insumo' })
  @ApiParam({ name: 'id', description: 'ID del insumo' })
  @ApiResponse({ status: 200, description: 'Insumo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateInsumoDto: UpdateInsumoDto,
  ) {
    return this.inventarioService.update(id, updateInsumoDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Actualizar el stock de un insumo' })
  @ApiParam({ name: 'id', description: 'ID del insumo' })
  @ApiResponse({ status: 200, description: 'Stock actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado.' })
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateStockDto: UpdateStockDto,
  ) {
    return this.inventarioService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un insumo (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del insumo' })
  @ApiResponse({ status: 204, description: 'Insumo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Insumo no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.remove(id);
  }

  @Post('verificar-alertas')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar y enviar alertas de inventario' })
  @ApiResponse({ status: 200, description: 'Alertas verificadas y enviadas.' })
  verificarAlertas() {
    return this.inventarioService.verificarAlertas();
  }
}
