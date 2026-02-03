// This is used by CLI.
import { config } from 'dotenv';
import { join } from 'node:path';

const ENV = process.env.NODE_ENV;
config({
  path: !ENV ? '.env' : `.env.${ENV}`,
  debug: true,
});

import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import DataBaseSeed from '@app/database/seeders/seed';
import { SeederOptions } from 'typeorm-extension';
import databaseConfig from '@app/core/config/database.config';

const dbConfig = databaseConfig();

console.log('This CLI operation was done on: ', {
  nodeEnv: dbConfig.environment,
  databasePort: dbConfig.port,
  databaseHost: dbConfig.host,
});

export default new DataSource({
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: false,
  logging: dbConfig.logging,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [join(__dirname, '../../database/src/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../../database/src/migrations/*{.ts,.js}')],
  migrationsTableName: 'admin_migrations',
  migrationsRun: dbConfig.isProduction,
  seeds: [DataBaseSeed],
  factories: [],
} as DataSourceOptions & SeederOptions);
