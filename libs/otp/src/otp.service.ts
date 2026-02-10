import { Injectable } from '@nestjs/common';
import { OtpRepository } from './repositories/otp.repository';
import { OtpType } from './entities/otp.entity';


@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
) {}


  async generateOtp(): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  async createOtp(email: string, otp: string, type: OtpType): Promise<void> {
    await this.otpRepository.createOtp(email, otp, type);
  }
  
  async otpExpired(expiresAt: Date): Promise<boolean> {
    const now = new Date();
    return expiresAt < now;
  }

  async findOtpByEmail(email: string) {
    return this.otpRepository.findOtpByEmail(email);
  }


  async removeOtp(otpEntry: any) {
    await this.otpRepository.removeOtp(otpEntry);
  }

}
