import { Module } from '@nestjs/common';
import { BaseRepositoryService } from './base-repository.service';

@Module({
  providers: [BaseRepositoryService],
  exports: [BaseRepositoryService],
})
export class BaseRepositoryModule {}
