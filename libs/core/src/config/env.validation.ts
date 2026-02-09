import { Environment } from '@app/common/enums/env.enum';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';

export class CommonEnvironmentVariables {
  // Application Environment Config
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Type(() => Number)
  @IsNumber()
  PORT: number;

  @IsNumber()
  @Type(() => Number)
  ADMIN_PORT: number;
  // Database Config
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Type(() => Number)
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

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
