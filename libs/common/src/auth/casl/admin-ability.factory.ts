import { AbilityBuilder } from '@casl/ability';
import { BaseAbilityFactory } from './base-ability.factory';
import { action, AppAbility } from './types';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AdminAbilityFactory extends BaseAbilityFactory {
  protected defineAbilitiesFor({ can }: AbilityBuilder<AppAbility>) {
    can(action.Manage, 'all');
  }
}
