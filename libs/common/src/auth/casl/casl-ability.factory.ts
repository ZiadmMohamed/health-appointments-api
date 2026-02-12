import { Injectable } from '@nestjs/common';
import { AdminAbilityFactory } from './admin-ability.factory';
import { AppAbility, role } from './types';
import { PatientAbilityFactory, UserPayload } from './patient-ability.factory';
@Injectable()
export class CaslAbilityFactory {
  constructor(
    private adminAbilityFactory: AdminAbilityFactory,
    private patientAbilityFactory: PatientAbilityFactory,
  ) {}
  //  user:UserEntity temprarly use interface
  createForUser(user: UserPayload): AppAbility {
    if (user.role === role.Admin) {
      return this.adminAbilityFactory.createForUser(user);
    } else if (user.role === role.Patient) {
      return this.patientAbilityFactory.createForUser(user);
    }
    return this.patientAbilityFactory.createForUser(user);
  }
}
