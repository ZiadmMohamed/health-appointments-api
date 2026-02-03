import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@app/user/repositories/user.repository';

export enum AuthStrategyType  {
  JWT = 'jwt',
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategyType.JWT) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) 
  {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.id);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Token revoked');
    }

    return user;
  }
}
