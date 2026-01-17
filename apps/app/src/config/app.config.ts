import { registerAs } from '@nestjs/config';

export interface AppConfig {
  name: string;
  env: string;
  port: number;
  apiPrefix: string;
  apiVersion: string;
  corsOrigin?: string;
}

export default registerAs('app', (): AppConfig => {
  return {
    name: 'Healthy',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api',
    apiVersion: process.env.API_VERSION || 'v1',
    corsOrigin: process.env.CORS_ORIGIN || '*',
  };
});
