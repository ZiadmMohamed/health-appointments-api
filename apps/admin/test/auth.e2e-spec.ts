import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '@app/auth';
import { AuthModule } from '../src/auth/auth.module';
import { Admin } from '@app/database/entities/admin.entity';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  const testAdmin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'Test',
    lastName: 'Admin',
    email: 'test@example.com',
    password: 'hashedPassword123',
    resetPasswordToken: null,
    resetPasswordExpires: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdminRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(Admin))
      .useValue(mockAdminRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should successfully login with correct credentials', async () => {
      const password = 'testPassword123';
      const hashedPassword = await authService.hashPassword(password);

      mockAdminRepository.findOne.mockResolvedValue({
        ...testAdmin,
        password: hashedPassword,
      });

      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/login')
        .send({
          email: testAdmin.email,
          password: password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('admin');
      expect(response.body).toHaveProperty('token');
      expect(response.body.admin.email).toBe(testAdmin.email);
    });

    it('should return 401 for invalid credentials', async () => {
      mockAdminRepository.findOne.mockResolvedValue(null);

      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing password', async () => {
      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/login')
        .send({
          email: testAdmin.email,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/request-password-reset', () => {
    it('should successfully request password reset', async () => {
      mockAdminRepository.findOne.mockResolvedValue(testAdmin);
      mockAdminRepository.update.mockResolvedValue({});

      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/request-password-reset')
        .send({
          email: testAdmin.email,
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('resetToken');
    });

    it('should return 404 for non-existent admin', async () => {
      mockAdminRepository.findOne.mockResolvedValue(null);

      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/request-password-reset')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/request-password-reset')
        .send({
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/reset-password', () => {
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
        ...testAdmin,
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: futureDate,
      });

      mockAdminRepository.save.mockResolvedValue({
        ...testAdmin,
        password: 'hashedNewPassword',
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/reset-password')
        .send({
          email: testAdmin.email,
          resetToken: resetToken,
          newPassword: newPassword,
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('admin');
      expect(response.body.admin.email).toBe(testAdmin.email);
    });

    it('should return 400 for invalid reset token', async () => {
      mockAdminRepository.findOne.mockResolvedValue(testAdmin);

      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/reset-password')
        .send({
          email: testAdmin.email,
          resetToken: 'invalidToken',
          newPassword: 'newPassword123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent admin', async () => {
      mockAdminRepository.findOne.mockResolvedValue(null);

      const response = await (request(app.getHttpServer()) as any)
        .post('/auth/reset-password')
        .send({
          email: 'nonexistent@example.com',
          resetToken: 'token',
          newPassword: 'newPassword123',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
});
