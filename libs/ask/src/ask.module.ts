import { Module } from '@nestjs/common';
import { AskService } from './ask.service';
import { AskRepository } from './Repository/ask.repo';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([AskRepository])],
  providers: [AskService, AskRepository],
  exports: [AskService, AskRepository, TypeOrmModule],
})
export class AskModule {}
