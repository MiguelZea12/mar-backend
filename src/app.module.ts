import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';

// Importar módulos de la aplicación
import { ClientesModule } from './modules/clientes/clientes.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InventarioModule } from './modules/inventario/inventario.module';

/**
 * Módulo principal de la aplicación
 * Patrón: Module Pattern - Organiza la aplicación en módulos cohesivos
 * Patrón: Dependency Injection - ConfigService inyectado para configuración
 */
@Module({
  imports: [
  // Configuración global
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    
    // Configuración de base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Módulos de negocio
    ClientesModule,
    MenuModule,
    OrdersModule,
    InventarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
