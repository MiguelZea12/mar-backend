import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria, MenuItem } from '../../entities';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';

/**
 * Módulo de Menú
 * Patrón: Module Pattern
 */
@Module({
  imports: [TypeOrmModule.forFeature([Categoria, MenuItem])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
