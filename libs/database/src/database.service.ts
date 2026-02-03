import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CustomTypeORMLogger } from './typeorm.logger';
import { IDatabaseConfig } from '@app/core/config/database.config';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig = this.configService.get<IDatabaseConfig>('database');

    return {
      type: dbConfig?.type,
      host: dbConfig?.host,
      port: dbConfig?.port,
      username: dbConfig?.username,
      password: dbConfig?.password,
      database: dbConfig?.database,
      synchronize: dbConfig?.synchronize,
      logger: new CustomTypeORMLogger(),
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      migrationsRun: dbConfig?.isProduction,
    };
  }
}
