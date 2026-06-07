import { Module, Global } from '@nestjs/common';
import { PatientAbilityFactory } from './patient-ability.factory';
import { CaslGuard } from './policies.guard';
import { CaslAbilityFactory } from './casl-ability.factory';
import { BaseAbilityFactory } from './base-ability.factory';
import { AdminAbilityFactory } from './admin-ability.factory';

@Global() 
@Module({
  providers: [CaslAbilityFactory, PatientAbilityFactory,AdminAbilityFactory,CaslGuard],
  exports: [CaslAbilityFactory, AdminAbilityFactory, CaslGuard], 
})
export class CaslModule {}