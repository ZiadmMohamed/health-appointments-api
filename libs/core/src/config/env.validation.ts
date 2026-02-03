/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Environment } from '@app/common/enums/env.enum';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CommonEnvironmentVariables {
  // Application Environment Config
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  APP_PORT: number;

  @IsNumber()
  ADMIN_PORT: number;
  // Database Config
  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  // @IsBoolean()
  // @IsOptional()
  // DB_SYNCHRONIZE?: boolean;

  // @IsBoolean()
  // @IsOptional()
  // DB_LOGGING?: boolean;

  // JWT Config
  // @IsString()
  // @IsOptional()
  // JWT_SECRET?: string;

  // @IsNumber()
  // @IsOptional()
  // JWT_EXPIRATION?: number;

  // API Config
  @IsString()
  @IsOptional()
  API_PREFIX?: string;

  @IsString()
  @IsOptional()
  API_VERSION?: string;

  // Cors Config
  // @IsString()
  // @IsOptional()
  // CORS_ORIGIN?: string;
}
