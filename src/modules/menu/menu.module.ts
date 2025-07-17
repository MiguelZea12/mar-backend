import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { Categoria } from '../../entities/categoria.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';

/**
 * Módulo de Menú
 * Patrón: Module Pattern
 */
@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Categoria])],
  controllers: [MenuController, ChatbotController],
  providers: [MenuService, ChatbotService],
  exports: [MenuService, ChatbotService],
})
export class MenuModule {}
