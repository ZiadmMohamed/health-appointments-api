import { DataSourceOptions } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CustomTypeORMLogger } from './typeorm.logger';
import { Environment } from '@app/common/common.types';
import DataBaseSeed from './seeders/seed';
import { SeederOptions } from 'typeorm-extension';
import { UserFactory } from './seeders/factories/user/user.factory';
import { User } from '@app/user';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions & SeederOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      synchronize: process.env.NODE_ENV === Environment.Development,
      logger:
        process.env.NODE_ENV !== Environment.Test
          ? new CustomTypeORMLogger()
          : undefined,
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      migrations: ['dist/**/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: process.env.NODE_ENV === Environment.Production,
      entities: [User],
      seeds: [DataBaseSeed],
      factories: [UserFactory],
    };
  }

  static getDataSourceOptions(): DataSourceOptions & SeederOptions {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [User],
      migrations: ['dist/apps/*/libs/database/src/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
      seeds: [DataBaseSeed],
      factories: [UserFactory],
    };
  }
}
