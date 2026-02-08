import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from '@app/auth/auth.service';
import { Public } from '@app/common/decorators/public.decorator';
import { CreateUserDto } from 'apps/app/src/modules/auth/dtos/create-user.dto';
import { LoginByEmailDto } from 'apps/app/src/modules/auth/dtos/login-by-email.dto';
import { VerifyOtpDto } from 'apps/app/src/modules/auth/dtos/verify-otp.dto';
import { LoginByPhoneDto } from 'apps/app/src/modules/auth/dtos/login-by-phone.dto';
import { ResetPasswordDto } from 'apps/app/src/modules/auth/dtos/reset-password.dto';
import { CheckEmailDto } from 'apps/app/src/modules/auth/dtos/check-email.dto';
import { OtpType } from 'libs/otp/src/entities/otp.entity';

// Response DTO placeholders
class RegisterResponseDto {}
class LoginResponseDto {}
class OtpResponseDto {}
class LogoutResponseDto {}
class ResetPasswordResponseDto {}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('hello')
  @ApiOperation({ summary: 'Test hello endpoint' })
  @ApiResponse({ status: 200, description: 'Returns hello message' })
  hello() {
    return this.authService.hello();
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: RegisterResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @Public()
  @Post('send-verification-otp')
  @ApiOperation({ summary: 'Send verification OTP to user email' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully', type: OtpResponseDto })
  @ApiResponse({ status: 400, description: 'Email already exists or invalid' })
  sendVerificationOtp(@Body() email: CheckEmailDto) {
    return this.authService.sendVerificationOtp(email);
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP sent to email' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully', type: OtpResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  verifyOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data);
  }

  @Public()
  @Post('login-by-email')
  @ApiOperation({ summary: 'Login using email and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginByEmail(@Body() data: LoginByEmailDto) {
    return this.authService.loginByEmail(data);
  }

  @Public()
  @Post('login-by-phone')
  @ApiOperation({ summary: 'Login using phone and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginByPhone(@Body() data: LoginByPhoneDto) {
    return this.authService.loginByNumber(data);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully', type: LogoutResponseDto })
  logout(@Req() request: Express.Request) {
    return this.authService.logout(request);
  }

  @Public()
  @Post('send-forget-password-otp')
  @ApiOperation({ summary: 'Send OTP for forgotten password' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully', type: OtpResponseDto })
  sendForgetPasswordOtp(@Body() email: CheckEmailDto) {
    return this.authService.sendVerificationOtp(email, OtpType.RESET_PASSWORD);
  }

  @Public()
  @Post('verify-forget-password-otp')
  @ApiOperation({ summary: 'Verify OTP for forgotten password' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully', type: OtpResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  verifyForgetPasswordOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verfyForgetPasswordOtp(data);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password using reset token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully', type: ResetPasswordResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid token or passwords do not match' })
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
