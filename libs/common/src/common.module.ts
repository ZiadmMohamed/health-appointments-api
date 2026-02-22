import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [],
  providers: [
    CommonService, 
  ],
  exports: [
    CommonService, 
  ],
})
export class CommonModule {}
