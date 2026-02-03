import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@app/auth';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordRequestDto } from './dtos/reset-password-request.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Admin } from '@app/database/entities/admin.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAdmin: Admin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    resetPasswordToken: null as unknown as string,
    resetPasswordExpires: null as unknown as Date,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthService = {
    login: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login', async () => {
      const loginDto: LoginDto = {
        email: mockAdmin.email,
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue({
        admin: mockAdmin,
        token: 'test-token',
      });

      const result = await controller.login(loginDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('admin');
      expect(result).toHaveProperty('token');
      expect(result.admin.email).toBe(mockAdmin.email);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  describe('requestPasswordReset', () => {
    it('should successfully request password reset', async () => {
      const resetRequestDto: ResetPasswordRequestDto = {
        email: mockAdmin.email,
      };

      mockAuthService.requestPasswordReset.mockResolvedValue('reset-token');

      const result = await controller.requestPasswordReset(resetRequestDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('resetToken');
      expect(mockAuthService.requestPasswordReset).toHaveBeenCalledWith(
        resetRequestDto.email,
      );
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        email: mockAdmin.email,
        resetToken: 'reset-token',
        newPassword: 'newPassword123',
      };

      mockAuthService.resetPassword.mockResolvedValue({
        ...mockAdmin,
        password: 'newHashedPassword',
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      const result = await controller.resetPassword(resetPasswordDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('admin');
      expect(result.admin.email).toBe(mockAdmin.email);
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.email,
        resetPasswordDto.resetToken,
        resetPasswordDto.newPassword,
      );
    });
  });
});
