import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import { action, Subjects } from './types';
import { check_ablility } from './check-policies.decorator';
import { UserPayload } from './patient-ability.factory';

export interface RuleRequired {
  action: action;
  subject: Subjects;
}
@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflactor: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const rule = this.reflactor.get<RuleRequired>(
      check_ablility,
      context.getHandler(),
    );
    const requset = context.switchToHttp().getRequest<{ user?: UserPayload }>();
    const user = requset.user;
    if (!user) return false;

    const ability = this.caslAbilityFactory.createForUser(user);
    const isAllowed = ability.can(rule.action, rule.subject);
    if (!isAllowed) {
      throw new ForbiddenException(
        'Access Denied: You do not have enough permissions',
      );
    }
    return true;
  }
}
