import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Environment } from './enums/env.enum';

export class EnvironmentVariables {
  // Application Environment Config
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Type(() => Number)
  APP_PORT: number;

  // Database Config
  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  @Type(() => Number)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE?: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING?: boolean;

  // JWT Config
  @IsString()
  @IsOptional()
  JWT_SECRET?: string;

  @IsNumber()
  @IsOptional()
  JWT_EXPIRATION?: number;

  // API Config
  @IsString()
  @IsOptional()
  API_PREFIX?: string;

  @IsString()
  @IsOptional()
  API_VERSION?: string;

  // Cors Config
  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
