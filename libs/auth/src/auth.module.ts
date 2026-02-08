import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Otp } from '../../otp/src/entities/otp.entity';
import { EmailService } from 'libs/email/src/email.service';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '@app/common';
import { UserService } from '@app/user/user.service';
import { OtpService } from 'libs/otp/src/otp.service';
import { UserModule } from '@app/user/user.module';
import { OtpModule } from 'libs/otp/src/otp.module';



@Module({
  imports: [
    UserModule,
    OtpModule,
    TypeOrmModule.forFeature([User, Otp]), 
    PassportModule,
    JwtModule.register({}),
    CommonModule,
  ],
  providers: [
    AuthService,
    UserService,
    JwtService, 
    EmailService, 
    OtpService,
  ],
  exports: [
    AuthService, 
    PassportModule, 
    JwtModule
  ],
})
export class AuthModule {}
