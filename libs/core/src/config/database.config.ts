import { registerAs } from '@nestjs/config';
import { CommonConfig } from './common.config';

export interface IDatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  isProduction: boolean;
  environment: string;
}

class DatabaseConfig extends CommonConfig {
  load(): IDatabaseConfig {
    return {
      type: 'postgres',
      host: this.getEnvString('DATABASE_HOST'),
      port: this.getEnvNumber('DATABASE_PORT'),
      username: this.getEnvString('DATABASE_USERNAME'),
      password: this.getEnvString('DATABASE_PASSWORD'),
      database: this.getEnvString('DATABASE_NAME', 'health_appointments'),
      synchronize: this.isDevelopment(),
      logging: !this.isTest(),
      isProduction: this.isProduction(),
      environment: this.getEnvString('NODE_ENV'),
    };
  }
}

export default registerAs('database', () => new DatabaseConfig().load());
