import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '@app/auth';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordRequestDto } from './dtos/reset-password-request.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { admin, token } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return {
      message: 'Login successful',
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
      token,
    };
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() resetRequestDto: ResetPasswordRequestDto) {
    const resetToken = await this.authService.requestPasswordReset(
      resetRequestDto.email,
    );

    // In a real application, you would send this token via email
    return {
      message: 'Password reset email sent',
      resetToken, // Remove this in production - send via email instead
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const admin = await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.resetToken,
      resetPasswordDto.newPassword,
    );

    return {
      message: 'Password reset successful',
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    };
  }
}
