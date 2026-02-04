import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from '@app/database/database.module';
import { CoreModule } from '@app/core';

@Module({
  imports: [DatabaseModule, CoreModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
