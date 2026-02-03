import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as CoreAuthModule } from '@app/auth';

@Module({
  imports: [CoreAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
