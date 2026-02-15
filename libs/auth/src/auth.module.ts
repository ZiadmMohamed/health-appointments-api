import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '@app/common';
import { UserModule } from '@app/user/user.module';
import { OtpModule } from 'libs/otp/src/otp.module';
import { JwtStrategy } from '@app/common/strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    OtpModule,
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
    CommonModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
