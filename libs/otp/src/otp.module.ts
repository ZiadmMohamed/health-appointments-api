import { Global, Module } from '@nestjs/common';
import { OtpRepository } from './repositories/otp.repository';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [OtpRepository, OtpService],
  exports: [OtpService],
})
export class OtpModule {}
