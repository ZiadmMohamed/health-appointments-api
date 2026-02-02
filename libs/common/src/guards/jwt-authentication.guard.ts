import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserRepository } from "@app/user/repositories/user.repository";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";


@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private readonly _JwtService: JwtService,
        private readonly _ConfigService: ConfigService,
        private readonly _UserRepository: UserRepository,
        private readonly reflector: Reflector,
    ) {}


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) return true;


        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeaders(request);
        if(!token) throw new UnauthorizedException();

        try {
            const payload = this._JwtService.verify(token, {
                secret: this._ConfigService.get("JWT_SECRET")
            })

            const user = await this._UserRepository.findById(payload.id);
            // console.log('Authenticated User:', user);

            if (!user) throw new UnauthorizedException('User not found');

            const tokenVersionVerified = payload.tokenVersion === user.tokenVersion;
            if (!tokenVersionVerified) throw new UnauthorizedException('Token version mismatch');

            request.user = user;
            // console.log('Request User:', request.user);
        } catch(error) {
            // console.error('Authentication Error:', error);
            throw new UnauthorizedException('Invalid token');
        }
        console.log('Authentication guard passed');
        return true;
    }

    private extractTokenFromHeaders(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type == "Bearer" ? token : undefined;
    }
}