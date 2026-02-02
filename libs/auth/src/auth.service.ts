import { Injectable, Req } from "@nestjs/common";
import { UserRepository } from "@app/user/repositories/user.repository";
import { CreateUserDto } from "@app/auth/dtos/create-user.dto";
import { LoginByEmailDto } from "./dtos/login-by-email.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { OtpRepository } from "./repositories/otp.repository";
import { VerifyOtpDto } from "./dtos/verify-otp.dto";
import { LoginByPhoneDto } from "./dtos/login-by-phone.dto";
import { User } from "./entities/user.entity";
import e, { request, Request } from 'express';
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { CheckEmailDto } from "./dtos/check-email.dto";
import { compareHash } from "@app/common/security/hash.util";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository, 
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpRepository: OtpRepository,
    private readonly mailerService: MailerService,
  ) {}


  async hello() {
    return "Hello from AuthService!";
  }


  async sendVerificationOtp(emailDto: CheckEmailDto) {
    const email = emailDto?.email;

    console.log('Email for OTP:', email);

    if (!email) {
      throw new Error('Email is required to send OTP');
    }

    const otpExists = await this.otpRepository.findOtpByEmail(email);
    if (otpExists) {
      const now = new Date();
      if (otpExists.expiresAt > now) {
        throw new Error('An active OTP already exists for this email address');
      }
      else {
        await this.otpRepository.removeOtp(otpExists);
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepository.createOtp(email, otp);

    await this.mailerService.sendMail({
      from: this.configService.get('EMAIL'),
      to: email,
      subject: 'Your Verification OTP',
      text: `Your verification OTP is ${otp}`,
    });

    // Logic to send OTP via SMS gateway would go here
    console.log(`Sending OTP ${otp} to email ${email}`);
    return otp;
  }


  async register(data: CreateUserDto) {
    data.email = data.email?.trim().toLowerCase();
    data.phone = data.phone?.trim();

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    await this.userRepository.createUser(data);

    console.log(`Created user with email ${data.email}`);
    
    const emailDto: CheckEmailDto = { email: data.email };

    await this.sendVerificationOtp(emailDto);

    return {success: true, message: 'User created successfully'};
  }


  async verifyOtp(data: VerifyOtpDto) {
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error('User not found');
    }

    const otpEntry = await this.otpRepository.findOne({ where: { email: data.email }, order: { createdAt: 'DESC' } });

    if (!otpEntry) {
      throw new Error('No OTP found for this email address');
    }
    const now = new Date();
    if (otpEntry.expiresAt < now) {
      throw new Error('OTP has expired');
    }

    if (!(await compareHash(data.otp, otpEntry.otpHash))) {
      throw new Error('Invalid OTP');
    }

    await this.otpRepository.remove(otpEntry);

    await this.userRepository.update({id: user.id}, {isActive: true});

    return {success: true, message: 'account verified successfully'};
  }


  async loginByEmail(data: LoginByEmailDto) {
    const user = await this.userRepository.findByEmail(data.email, true);
    console.log(user);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!(await compareHash(data.password, user.password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('User account is not active');
    }

    
    const access_token = this.jwtService.sign(
      {id: user.id, tokenVersion: user.tokenVersion},
      {
        secret: this.configService.get('JWT_SECRET'), 
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      }
    );


    const refresh_token = this.jwtService.sign(
      {id: user.id, tokenVersion: user.tokenVersion},
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      }
    );


    return {success: true, data: {access_token, refresh_token}};
  }



  async loginByNumber(data: LoginByPhoneDto) {
    const user = await this.userRepository.findOne({ where: { phone: data.phone }, select: ['id', 'phone', 'password', 'isActive', 'tokenVersion'] });

    if (!user) {
      throw new Error('Invalid phone number or password');
    }

    if (!(await compareHash(data.password, user.password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('User account is not active');
    }

    const access_token = this.jwtService.sign(
      {id: user.id, tokenVersion: user.tokenVersion},
      {
        secret: this.configService.get('JWT_SECRET'), 
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      }
    );

    const refresh_token = this.jwtService.sign(
      {id: user.id, tokenVersion: user.tokenVersion},
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      }
    );

    return {success: true, data: {access_token, refresh_token}};
  }

  

  async logout(@Req() request: Express.Request) {
    const req = request as Request & { user?: User };
    const authUser = req.user;
    if (!authUser?.id) {
      throw new Error('User not found');
    }

    const user = await this.userRepository.findById(authUser.id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.updateUser(user.id, { tokenVersion: user.tokenVersion + 1 });

    return { success: true, message: 'Logged out successfully' };
  }

  // async forgetPassword(email: string) {
  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (!user) {
  //     throw new Error('User with this email does not exist');
  //   }

  //   const otpExists = await this.otpRepository.findOtpByEmail(user.email);
  //   if (otpExists) {
  //     const now = new Date();
  //       if (otpExists.expiresAt > now) {
  //         throw new Error('OTP already exists and is not expired');
  //       }
  //   }

  //   const emailDto: CheckEmailDto = { email: user.email };

  //   await this.sendVerificationOtp(emailDto);

  //   return { success: true, message: 'OTP sent to your email address' };
  // }



  async verfyForgetPasswordOtp(data: VerifyOtpDto) {
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error('User not found');
    }

    const otpEntry = await this.otpRepository.findOne({ where: { email: data.email }, order: { createdAt: 'DESC' } });
    if (!otpEntry) {
      throw new Error('No OTP found for this email address');
    }
    const now = new Date();
    if (otpEntry.expiresAt < now) {
      throw new Error('OTP has expired');
    }

    if (!(await compareHash(data.otp, otpEntry.otpHash))) {
      throw new Error('Invalid OTP');
    }

    await this.otpRepository.remove(otpEntry);

    const resetToken = this.jwtService.sign(
      {id: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }
    );

    return {success: true, message: 'OTP verified successfully', data: { resetToken }};
  }


  
  async resetPassword(data: ResetPasswordDto) {
    const payload = this.jwtService.verify(data.resetToken, {
      secret: this.configService.get('JWT_SECRET'),
    });

    if (!payload?.id) {
      throw new Error('Invalid reset token');
    }

    const user = await this.userRepository.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.password = data.newPassword;
    await this.userRepository.save(user);

    return { success: true, message: 'Password reset successfully' };
  }

}
