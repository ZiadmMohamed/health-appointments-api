import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { validate } from '@app/core/config/utils/validate-config';
import { AppEnvironmentVariables } from './config/app-env.variables';
import { getEnvName } from '@app/core/config/utils/get-env-name';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvName(),
      load: [appConfig],
      validate: validate(AppEnvironmentVariables),
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
