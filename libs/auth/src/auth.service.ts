import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { Admin } from '@app/database/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ admin: Admin; token: string }> {
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    const isPasswordValid = await this.comparePassword(
      password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // In a real application, you would generate a JWT token here
    const token = this.generateToken(admin.id);

    return { admin, token };
  }

  async requestPasswordReset(email: string): Promise<string> {
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1); // Token expires in 1 hour

    await this.adminRepository.update(admin.id, {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: expirationTime,
    });

    return resetToken;
  }

  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string,
  ): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    if (admin.resetPasswordToken !== resetTokenHash) {
      throw new BadRequestException('Invalid reset token');
    }

    if (
      !admin.resetPasswordExpires ||
      admin.resetPasswordExpires < new Date()
    ) {
      throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    admin.password = hashedPassword;
    admin.resetPasswordToken = null as unknown as string;
    admin.resetPasswordExpires = null as unknown as Date;

    const updatedAdmin = await this.adminRepository.save(admin);

    return updatedAdmin;
  }

  private generateToken(adminId: string): string {
    // this for now generates a dummy token. Replace with JWT or other token generation logic after authentication complete .
    return Buffer.from(`${adminId}:${Date.now()}`).toString('base64');
  }
}
