import { Module } from '@nestjs/common';
import { AskService } from './ask.service';

@Module({
  providers: [AskService],
  exports: [AskService],
})
export class AskModule {}
