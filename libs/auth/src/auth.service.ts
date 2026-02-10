import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from 'apps/app/src/modules/auth/dtos/create-user.dto';
import { LoginByEmailDto } from '../../../apps/app/src/modules/auth/dtos/login-by-email.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpDto } from '../../../apps/app/src/modules/auth/dtos/verify-otp.dto';
import { LoginByPhoneDto } from '../../../apps/app/src/modules/auth/dtos/login-by-phone.dto';
import { User } from '../../user/src/entities/user.entity';
import { Request } from 'express';
import { ResetPasswordDto } from '../../../apps/app/src/modules/auth/dtos/reset-password.dto';
import { CheckEmailDto } from '../../../apps/app/src/modules/auth/dtos/check-email.dto';
import { compareHash } from '@app/common/security/hash.util';
import { EmailService } from 'libs/email/src/email.service';
import { UserService } from '@app/user/user.service';
import { OtpType } from '../../otp/src/entities/otp.entity';
import { OtpService } from 'libs/otp/src/otp.service';

interface ResetTokenPayload {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  async sendVerificationOtp(
    emailDto: CheckEmailDto,
    type: OtpType = OtpType.VERIFICATION,
  ) {
    const email = emailDto?.email;

    if (!email) {
      throw new NotFoundException('Email is required');
    }

    const otpExists = await this.otpService.findOtpByEmail(email);
    if (otpExists) {
      if (await this.otpService.otpExpired(otpExists.expiresAt)) {
        throw new BadRequestException(
          'An active OTP already exists for this email address',
        );
      } else {
        await this.otpService.removeOtp(otpExists);
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpService.createOtp(email, otp, type);

    await this.emailService.sendOtpToMail(email, otp);

    return otp;
  }

  async register(data: CreateUserDto) {
    data.email = data.email?.trim().toLowerCase();
    data.phone = data.phone?.trim();

    const existingUser = await this.userService.findUserByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    await this.userService.createUser(data);

    const emailDto: CheckEmailDto = { email: data.email };

    await this.sendVerificationOtp(emailDto);

    return { success: true, message: 'User created successfully' };
  }

  async verifyOtp(data: VerifyOtpDto) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpEntry = await this.otpService.findOtpByEmail(data.email);
    if (!otpEntry) {
      throw new NotFoundException('No OTP found for this email address');
    }

    const otpType = otpEntry.type;
    if (otpType !== OtpType.VERIFICATION) {
      throw new BadRequestException('OTP type mismatch');
    }

    const now = new Date();
    if (otpEntry.expiresAt < now) {
      throw new BadRequestException('OTP has expired');
    }

    if (!(await compareHash(data.otp, otpEntry.otpHash))) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpService.removeOtp(otpEntry);

    await this.userService.updateUser(user.id, { isActive: true });

    return { success: true, message: 'account verified successfully' };
  }

  async loginByEmail(data: LoginByEmailDto) {
    const user = await this.userService.findUserByEmail(data.email, true);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    if (!(await compareHash(data.password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new BadRequestException('User account is not active');
    }

    const access_token = this.jwtService.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      },
    );

    const refresh_token = this.jwtService.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      },
    );

    return { success: true, data: { access_token, refresh_token } };
  }

  async loginByNumber(data: LoginByPhoneDto) {
    const user = await this.userService.findUserByPhone(data.phone);

    if (!user) {
      throw new NotFoundException('Invalid phone number or password');
    }

    if (!(await compareHash(data.password, user.password))) {
      throw new BadRequestException('Invalid phone number or password');
    }

    if (!user.isActive) {
      throw new BadRequestException('User account is not active');
    }

    const access_token = this.jwtService.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      },
    );

    const refresh_token = this.jwtService.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      },
    );

    return { success: true, data: { access_token, refresh_token } };
  }

  async logout(@Req() request: Express.Request) {
    const req = request as Request & { user?: User };
    const authUser = req.user;

    if (!authUser?.id) {
      throw new UnauthorizedException('User not found');
    }

    const user = await this.userService.findUserById(authUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.updateUser(user.id, {
      tokenVersion: user.tokenVersion + 1,
    });

    return { success: true, message: 'Logged out successfully' };
  }

  async verfyForgetPasswordOtp(data: VerifyOtpDto) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpEntry = await this.otpService.findOtpByEmail(data.email);
    if (!otpEntry) {
      throw new NotFoundException('No OTP found for this email address');
    }

    const now = new Date();
    if (otpEntry.expiresAt < now) {
      throw new UnprocessableEntityException('OTP has expired');
    }

    const otpType = otpEntry.type;
    if (otpType !== OtpType.RESET_PASSWORD) {
      throw new BadRequestException('OTP type mismatch');
    }

    if (!(await compareHash(data.otp, otpEntry.otpHash))) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpService.removeOtp(otpEntry);

    const resetToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      },
    );

    return {
      success: true,
      message: 'OTP verified successfully',
      data: { resetToken },
    };
  }

  async resetPassword(data: ResetPasswordDto) {
    const payload = this.jwtService.verify<ResetTokenPayload>(data.resetToken, {
      secret: this.configService.get('JWT_SECRET'),
    });

    if (!payload.id) {
      throw new UnauthorizedException('Invalid reset token');
    }

    const user = await this.userService.findUserById(payload.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = data.newPassword;
    await this.userService.updateUser(user.id, { password: user.password });

    return { success: true, message: 'Password reset successfully' };
  }
}
