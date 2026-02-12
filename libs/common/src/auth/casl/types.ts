import { MongoAbility } from '@casl/ability';

export enum action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
export enum role {
  Admin = 'admin',
  Doctor = 'doctor',
  Patient = 'patient',
}
//  import { User } from '../users/entities/user.entity';
// like infraSubjects <typeof userEntity | typeof patienEntity>
export type Subjects = 'all';
export type AppAbility = MongoAbility<[action, Subjects]>;
