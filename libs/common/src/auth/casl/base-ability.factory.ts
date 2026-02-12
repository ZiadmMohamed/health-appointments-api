import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { AppAbility } from './types';
import { UserPayload } from './patient-ability.factory';
// user:UserEntity temprarly use interface

export abstract class BaseAbilityFactory {
  createForUser(user: UserPayload): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
    this.defineAbilitiesFor(builder, user);
    //         return builder.build({detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>})

    return builder.build();
  }
  protected abstract defineAbilitiesFor(
    bulider: AbilityBuilder<AppAbility>,
    user: UserPayload,
  ): void;
}
