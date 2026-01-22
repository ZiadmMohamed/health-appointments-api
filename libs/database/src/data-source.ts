// This is used by CLI.
const ENV = process.env.NODE_ENV;
import { DatabaseService } from './database.service';
import { config } from 'dotenv';
config({
  path: !ENV ? '.env' : `.env.${ENV}`,
  debug: true,
});

import { DataSource } from 'typeorm';

console.log('This CLI operation was done on: ', {
  nodeEnv: process.env.NODE_ENV,
  databasePort: process.env.DATABASE_PORT,
  databaseHost: process.env.DATABASE_HOST,
});
export default new DataSource(DatabaseService.getDataSourceOptions());
