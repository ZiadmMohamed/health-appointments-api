import { DataSource } from 'typeorm';
import { DatabaseService } from './database.service';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource(DatabaseService.getDataSourceOptions());
