import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '@app/user/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { OtpRepository } from './repositories/otp.repository';
import { Otp } from './entities/otp.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    TypeOrmModule.forFeature([Otp]),
  ],
  providers: [AuthService, UserRepository, JwtService, OtpRepository],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}
