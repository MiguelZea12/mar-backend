import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Función principal para inicializar la aplicación
 * Configura Swagger, validación global y CORS
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4200'], // Permitir frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Configurar prefijo global para las rutas de la API
  app.setGlobalPrefix('api');

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remover propiedades no definidas en DTO
    forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas
    transform: true, // Transformar tipos automáticamente
    transformOptions: {
      enableImplicitConversion: true, // Conversión implícita de tipos
    },
  }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Catering Management API')
    .setDescription(`
      API REST para sistema de gestión de catering que incluye:
      
      📋 **Funcionalidades principales:**
      - Gestión de clientes (registro, edición, historial)
      - Catálogo de menús y alimentos
      - Creación y personalización de pedidos
      - Gestión de inventario de insumos
      - Planificación de entregas
      - Panel de administración con métricas
      
      🏗️ **Patrones de diseño implementados:**
      - **Repository Pattern**: Acceso a datos
      - **Factory Pattern**: Generación de números de orden
      - **Observer Pattern**: Notificaciones y alertas
      - **Strategy Pattern**: Diferentes tipos de búsqueda
      - **DTO Pattern**: Transferencia de datos
      
      🔧 **Tecnologías:**
      - NestJS + TypeScript
      - PostgreSQL + TypeORM
      - Swagger para documentación
      - Class Validator para validaciones
    `)
    .setVersion('1.0')
    .addTag('clientes', 'Gestión de clientes del sistema')
    .addTag('menu', 'Catálogo de menús y categorías')
    .addTag('orders', 'Gestión de pedidos de catering')
    .addTag('inventario', 'Gestión de inventario de insumos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Catering API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Aplicación iniciada en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
  console.log(`🗄️  Base de datos: PostgreSQL`);
  console.log(`📊 Métricas disponibles en: /api/orders/estadisticas`);
}

bootstrap();
