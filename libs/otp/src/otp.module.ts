import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpRepository } from './repositories/otp.repository';
import { OtpService } from './otp.service';

@Global()
@Module({
  imports: [
  ],
  providers: [
    OtpRepository,
    OtpService
  ],
  exports: [
    OtpRepository,
    OtpService
  ],
})
export class OtpModule {}
