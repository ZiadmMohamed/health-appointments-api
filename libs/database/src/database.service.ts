import { DataSourceOptions } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CustomTypeORMLogger } from './typeorm.logger';
import { Environment } from '@app/common/common.types';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get<Environment>('NODE_ENV');
    const isProduction = nodeEnv === Environment.Production;

    const config: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      synchronize: !isProduction,
      logging: !isProduction,
      logger:
        nodeEnv !== Environment.Test ? new CustomTypeORMLogger() : undefined,
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      migrations: ['dist/**/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: isProduction,
    };

    this.logger.log(`Database configuration loaded for ${nodeEnv} environment`);

    return config;
  }

  /**
   * Get base configuration for DataSource (used by TypeORM CLI)
   */
  static getDataSourceOptions(): DataSourceOptions {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,

      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/**/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
    };
  }
}
