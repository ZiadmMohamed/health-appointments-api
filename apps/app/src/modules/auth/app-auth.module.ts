import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth';
import { AuthController } from './app-auth.controller';
import { APP_GUARD } from '@nestjs/core';
// import { AuthenticationGuard } from '@app/common/guards/jwt-authentication.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@app/common/guards/jwt-authentication.guard';


@Module({
  imports: [
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [
    // JwtService, 
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthenticationGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],

  exports: [],
})
export class AppAuthModule {}
