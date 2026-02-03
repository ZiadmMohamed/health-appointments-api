import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/utils/validate-config';
import { AppEnvironmentVariables } from 'apps/app/src/config/app-env.variables';
import appConfig from 'apps/app/src/config/app.config';
import databaseConfig from './config/database.config';
import { getEnvName } from './config/utils/get-env-name';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvName(),
      load: [appConfig, databaseConfig],
      validate: validate(AppEnvironmentVariables),
      cache: true,
    }),
  ],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
