import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from '@app/database/database.module';
import { CoreModule } from '@app/core';
import { CaslModule } from '@app/common/auth/casl';
import { validate } from '@app/core/validation/env.validation';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from '@app/article';

@Module({
  imports: [DatabaseModule, CoreModule,CaslModule,ArticleModule, ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
        validate,
        cache: true,
      }),],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
