import { Module } from '@nestjs/common';
import { AskRepository } from './Repository/ask.repo';
import { Ask } from './entity/ask.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AskController } from 'apps/app/src/modules/ask/ask.controller';
import { AskService } from './service/ask.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ask])],
  controllers: [AskController],
  providers: [AskService, AskRepository],
  exports: [AskService, AskRepository, TypeOrmModule],
})
export class AskModule {}
