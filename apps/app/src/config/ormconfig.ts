import DataBaseSeed from '@app/database/seeders/seed';
import { join } from 'node:path';
import { SeederOptions } from 'node_modules/typeorm-extension/dist/seeder/type';
import { config } from 'dotenv';

// Load environment variables for CLI usage
const ENV = process.env.NODE_ENV;
config({
  path: !ENV ? '.env' : `.env.${ENV}`,
  debug: true,
});

import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
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
  entities: [join(__dirname, '../**/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  migrationsTableName: 'app_migrations',
  migrationsRun: dbConfig.isProduction,
  seeds: [DataBaseSeed],
  factories: [],
} as DataSourceOptions & SeederOptions);
