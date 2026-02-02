import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/database/database.module';
import { CoreModule } from '@app/core';
import { AppAuthModule } from './modules/auth/app-auth.module';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    DatabaseModule, 
    CoreModule, 
    AppAuthModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('HOST'),
            auth: {
              user: configService.get('EMAIL'),
              pass: configService.get('PASS'),
            },
          },
          from: configService.get('EMAIL'),
        };
      },
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
