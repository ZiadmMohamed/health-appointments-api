import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin } from '@app/database/entities/admin.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockAdmin: Admin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: '$2b$10$...',
    resetPasswordToken: null as unknown as string,
    resetPasswordExpires: null as unknown as Date,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdminRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);

      const result = await service.comparePassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);

      const result = await service.comparePassword(
        'wrongPassword',
        hashedPassword,
      );

      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);

      mockAdminRepository.findOne.mockResolvedValue({
        ...mockAdmin,
        password: hashedPassword,
      });

      const result = await service.login(mockAdmin.email, password);

      expect(result).toHaveProperty('admin');
      expect(result).toHaveProperty('token');
      expect(result.admin.email).toBe(mockAdmin.email);
      expect(mockAdminRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockAdmin.email },
      });
    });

    it('should throw UnauthorizedException for non-existent admin', async () => {
      mockAdminRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login('nonexistent@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive admin', async () => {
      mockAdminRepository.findOne.mockResolvedValue({
        ...mockAdmin,
        isActive: false,
      });

      await expect(service.login(mockAdmin.email, 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      const hashedPassword = await service.hashPassword('correctPassword');

      mockAdminRepository.findOne.mockResolvedValue({
        ...mockAdmin,
        password: hashedPassword,
      });

      await expect(
        service.login(mockAdmin.email, 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('requestPasswordReset', () => {
    it('should generate a reset token for existing admin', async () => {
      mockAdminRepository.findOne.mockResolvedValue(mockAdmin);
      mockAdminRepository.update.mockResolvedValue({});

      const resetToken = await service.requestPasswordReset(mockAdmin.email);

      expect(resetToken).toBeTruthy();
      expect(resetToken.length).toBeGreaterThan(0);
      expect(mockAdminRepository.update).toHaveBeenCalledWith(
        mockAdmin.id,
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          resetPasswordToken: expect.any(String),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          resetPasswordExpires: expect.any(Date),
        }),
      );
    });

    it('should throw NotFoundException for non-existent admin', async () => {
      mockAdminRepository.findOne.mockResolvedValue(null);

      await expect(
        service.requestPasswordReset('nonexistent@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password with valid token', async () => {
      const newPassword = 'newPassword123';
      const resetToken = 'resetToken123';
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const crypto = await import('node:crypto');
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      mockAdminRepository.findOne.mockResolvedValue({
        ...mockAdmin,
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: futureDate,
      });

      mockAdminRepository.save.mockResolvedValue({
        ...mockAdmin,
        password: 'hashedNewPassword',
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      const result = await service.resetPassword(
        mockAdmin.email,
        resetToken,
        newPassword,
      );

      expect(result).toHaveProperty('password');
      expect(result.resetPasswordToken).toBeNull();
      expect(result.resetPasswordExpires).toBeNull();
      expect(mockAdminRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent admin', async () => {
      mockAdminRepository.findOne.mockResolvedValue(null);

      await expect(
        service.resetPassword(
          'nonexistent@example.com',
          'token',
          'newPassword',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid reset token', async () => {
      mockAdminRepository.findOne.mockResolvedValue(mockAdmin);

      await expect(
        service.resetPassword(mockAdmin.email, 'invalidToken', 'newPassword'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for expired reset token', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const crypto = await import('node:crypto');
      const resetToken = 'resetToken123';
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      mockAdminRepository.findOne.mockResolvedValue({
        ...mockAdmin,
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: pastDate,
      });

      await expect(
        service.resetPassword(mockAdmin.email, resetToken, 'newPassword'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
