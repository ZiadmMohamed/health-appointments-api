import { Module } from '@nestjs/common';
import { AskService } from './ask.service';
import { AskRepository } from './Repository/ask.repo';

@Module({
  providers: [AskService, AskRepository],
  exports: [AskService, AskRepository],
})
export class AskModule {}
