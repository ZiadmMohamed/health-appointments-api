import { SetMetadata } from '@nestjs/common';
import { action, Subjects } from './types';

// @CheckAbility(Action.Read, User)
export const check_ablility = 'check_ability';
export const CheckAbility = (action: action, Subject: Subjects) =>
  SetMetadata(check_ablility, { action, Subject });
