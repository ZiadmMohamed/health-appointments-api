import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '@app/user/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { OtpRepository } from './repositories/otp.repository';
import { Otp } from './entities/otp.entity';
import { EmailService } from 'libs/email/src/email.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@app/common/strategies/jwt.strategy';
import { CommonModule } from '@app/common';
import { UserService } from '@app/user/user.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]), 
    PassportModule,
    JwtModule.register({}),
    CommonModule,
  ],
  providers: [
    AuthService,
    UserRepository,
    UserService,
    JwtService, 
    OtpRepository, 
    EmailService, 
    JwtStrategy
  ],
  exports: [
    AuthService, 
    UserRepository, 
    PassportModule, 
    JwtModule
  ],
})
export class AuthModule {}
