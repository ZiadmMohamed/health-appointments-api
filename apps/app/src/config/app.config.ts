import { registerAs } from '@nestjs/config';
import { CommonConfig } from '../../../../libs/core/src/config/common.config';

export interface IAppConfig {
  name: string;
  env: string;
  port: number;
  apiPrefix: string;
  apiVersion?: string;
}

class AppConfig extends CommonConfig {
  load(): IAppConfig {
    return {
      name: this.getEnvString('APP_NAME', 'Healthy'),
      env: this.getEnvString('NODE_ENV', 'development'),
      port: this.getEnvNumber('PORT', 3000),
      apiPrefix: this.getEnvString('API_PREFIX', 'api'),
      apiVersion: this.getEnvString('API_VERSION', 'v1'),
    };
  }
}

export default registerAs('app', () => new AppConfig().load());
