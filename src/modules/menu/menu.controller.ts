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
import { MenuService } from './menu.service';
import {
  CreateCategoriaDto,
  CreateMenuItemDto,
  UpdateCategoriaDto,
  UpdateMenuItemDto,
} from './dto';

/**
 * Controlador de Menú
 * Patrón: MVC - Controller
 */
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // =============== CATEGORÍAS ===============

  @Post('categorias')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente.' })
  createCategoria(@Body(ValidationPipe) createCategoriaDto: CreateCategoriaDto) {
    return this.menuService.createCategoria(createCategoriaDto);
  }

  @Get('categorias')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida exitosamente.' })
  findAllCategorias() {
    return this.menuService.findAllCategorias();
  }

  @Get('categorias/:id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  findOneCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOneCategoria(id);
  }

  @Patch('categorias/:id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.menuService.updateCategoria(id, updateCategoriaDto);
  }

  @Delete('categorias/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  removeCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeCategoria(id);
  }

  // =============== MENU ITEMS ===============

  @Post('items')
  @ApiOperation({ summary: 'Crear un nuevo item del menú' })
  @ApiResponse({ status: 201, description: 'Item del menú creado exitosamente.' })
  createMenuItem(@Body(ValidationPipe) createMenuItemDto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(createMenuItemDto);
  }

  @Get('items')
  @ApiOperation({ summary: 'Obtener todos los items del menú' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad por página' })
  @ApiQuery({ name: 'categoriaId', required: false, description: 'Filtrar por categoría' })
  findAllMenuItems(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('categoriaId', new ParseIntPipe({ optional: true })) categoriaId?: number,
  ) {
    return this.menuService.findAllMenuItems(page, limit, categoriaId);
  }

  @Get('items/buscar')
  @ApiOperation({ summary: 'Buscar items del menú por criterios' })
  @ApiQuery({ name: 'nombre', required: false, description: 'Nombre del item' })
  @ApiQuery({ name: 'categoriaId', required: false, description: 'ID de la categoría' })
  @ApiQuery({ name: 'precioMin', required: false, description: 'Precio mínimo' })
  @ApiQuery({ name: 'precioMax', required: false, description: 'Precio máximo' })
  @ApiQuery({ name: 'ingredientes', required: false, description: 'Ingredientes (separados por coma)' })
  @ApiQuery({ name: 'sinAlergenos', required: false, description: 'Evitar alérgenos (separados por coma)' })
  buscarMenuItems(
    @Query('nombre') nombre?: string,
    @Query('categoriaId', new ParseIntPipe({ optional: true })) categoriaId?: number,
    @Query('precioMin', new ParseIntPipe({ optional: true })) precioMin?: number,
    @Query('precioMax', new ParseIntPipe({ optional: true })) precioMax?: number,
    @Query('ingredientes') ingredientes?: string,
    @Query('sinAlergenos') sinAlergenos?: string,
  ) {
    const criterios = {
      nombre,
      categoriaId,
      precioMin,
      precioMax,
      ingredientes: ingredientes ? ingredientes.split(',').map(i => i.trim()) : undefined,
      sinAlergenos: sinAlergenos ? sinAlergenos.split(',').map(a => a.trim()) : undefined,
    };

    return this.menuService.buscarMenuItems(criterios);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Obtener un item del menú por ID' })
  @ApiParam({ name: 'id', description: 'ID del item del menú' })
  findOneMenuItem(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOneMenuItem(id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Actualizar un item del menú' })
  @ApiParam({ name: 'id', description: 'ID del item del menú' })
  updateMenuItem(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, updateMenuItemDto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un item del menú' })
  @ApiParam({ name: 'id', description: 'ID del item del menú' })
  removeMenuItem(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeMenuItem(id);
  }

  // =============== CATÁLOGO Y ESTADÍSTICAS ===============

  @Get('catalogo')
  @ApiOperation({ summary: 'Obtener catálogo completo organizado por categorías' })
  @ApiResponse({ status: 200, description: 'Catálogo completo obtenido exitosamente.' })
  getCatalogoCompleto() {
    return this.menuService.getCatalogoCompleto();
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas del menú' })
  @ApiResponse({ status: 200, description: 'Estadísticas del menú obtenidas exitosamente.' })
  getEstadisticasMenu() {
    return this.menuService.getEstadisticasMenu();
  }
}
