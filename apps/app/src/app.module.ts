import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/database/database.module';
import { CoreModule } from '@app/core';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../../../libs/core/src/validation/env.validation';
import appConfig from './config/app.config';

@Module({
  imports: [
    DatabaseModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [appConfig],
      validate,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
