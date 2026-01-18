import { registerAs } from '@nestjs/config';
import { CommonConfig } from './common.config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  ssl: boolean;
}

class DatabaseConfigClass extends CommonConfig {
  load(): DatabaseConfig {
    return {
      host: this.getEnvString('DB_HOST', 'localhost'),
      port: this.getEnvNumber('DB_PORT', 5432),
      username: this.getEnvString('DB_USERNAME', 'postgres'),
      password: this.getEnvString('DB_PASSWORD', 'postgres'),
      database: this.getEnvString('DB_DATABASE', 'healthy_db'),
      synchronize: this.getEnvBoolean('DB_SYNCHRONIZE', this.isDevelopment()),
      logging: this.getEnvBoolean('DB_LOGGING', this.isDevelopment()),
      ssl: this.isProduction(),
    };
  }
}

export default registerAs('database', () => new DatabaseConfigClass().load());
