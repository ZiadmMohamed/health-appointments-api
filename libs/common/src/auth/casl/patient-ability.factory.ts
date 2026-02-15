import { Injectable } from '@nestjs/common';
import { BaseAbilityFactory } from './base-ability.factory';
import { action, AppAbility, role } from './types';
import { AbilityBuilder } from '@casl/ability';
export interface UserPayload {
  id: number;
  role: role;
}
@Injectable()
export class PatientAbilityFactory extends BaseAbilityFactory {
  defineAbilitiesFor({ can, cannot }: AbilityBuilder<AppAbility>) {
    can(action.Read, 'all');
    // can(action.Create,'Appointment')
    // can(action.Update,"User",{id:user.id})
    cannot(action.Delete, 'all').because('Patients cannot delete anything');
  }
}
