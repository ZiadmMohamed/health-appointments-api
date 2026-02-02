import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';

import { AuthService } from '@app/auth/auth.service';
import { Public } from '@app/common/decorators/public.decorator';
import { CreateUserDto } from '@app/auth/dtos/create-user.dto';
import { LoginByEmailDto } from '@app/auth/dtos/login-by-email.dto';
import { VerifyOtpDto } from '@app/auth/dtos/verify-otp.dto';
import { LoginByPhoneDto } from '@app/auth/dtos/login-by-phone.dto';
import { ResetPasswordDto } from '@app/auth/dtos/reset-password.dto';
import { CheckEmailDto } from '@app/auth/dtos/check-email.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('hello')
  hello() {
    return this.authService.hello();
  }

  @Public()
  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @Public()
  @Post('send-verification-otp')
  sendVerificationOtp(@Body() email: CheckEmailDto) {
    console.log('Received email for OTP:', email.email);
    return this.authService.sendVerificationOtp(email);
  }

  @Public()
  @Post('verify-otp')
  verifyOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data);
  }

  @Public()
  @Post('login-by-email')
  loginByEmail(@Body() data: LoginByEmailDto) {
    return this.authService.loginByEmail(data);
  }

  @Public()
  @Post('login-by-phone')
  loginByNumber(@Body() data: LoginByPhoneDto) {
    return this.authService.loginByNumber(data);
  }

  @Post('logout')
  logout(@Req() request: Express.Request) {
    return this.authService.logout(request);
  }

  // @Public()
  // @Post('/forget-password')
  // forgetPassword(@Body('email') email: string) {
  //   return this.authService.forgetPassword(email);
  // }

  @Public()
  @Post('/verify-forget-password-otp')
  verfyForgetPasswordOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verfyForgetPasswordOtp(data);
  }

  @Public()
  @Post('/reset-password')
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
