import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from '@app/database/database.module';
import { CoreModule } from '@app/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, CoreModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
