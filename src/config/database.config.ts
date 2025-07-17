import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Configuración de la base de datos PostgreSQL
 * Patrón: Configuration Object
 */
export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') === 'development', // Solo en desarrollo
  logging: true, // Activamos el logging para ver qué pasa con las tablas
  // Configuración SSL para Neon (base de datos en la nube)
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
