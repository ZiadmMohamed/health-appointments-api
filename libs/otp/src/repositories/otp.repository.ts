// src/modules/user/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Otp, OtpType } from '../entities/otp.entity';


@Injectable()
export class OtpRepository extends Repository<Otp> {
  constructor(private readonly dataSource: DataSource) {
    super(Otp, dataSource.createEntityManager());
  }

  async createOtp(email: string, otp: string, type: OtpType): Promise<void> {
    const otpEntry = this.create({
        email,
        otpHash: otp,
        type,
    });
    await this.save(otpEntry);
  }

  async findOtpByEmail(email: string): Promise<Otp | null> {
    return this.findOne({ where: { email }, order: { createdAt: 'DESC' } });
  }

  async removeOtp(otpEntry: Otp): Promise<void> {
    await this.remove(otpEntry);
  }
}