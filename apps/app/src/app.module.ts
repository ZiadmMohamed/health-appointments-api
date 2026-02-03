import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/database/database.module';
import { CoreModule } from '@app/core';
import { AppAuthModule } from './modules/auth/app-auth.module';
import { EmailModule } from 'libs/email/src';



@Module({
  imports: [
    DatabaseModule, 
    CoreModule, 
    AppAuthModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
