import { ArticleEntity } from '@app/article/entity/article.entity';
import { InferSubjects, MongoAbility } from '@casl/ability';
import { Ask } from '@pp/ask/entity/ask.entity';

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
export type Subjects = InferSubjects<typeof Ask | typeof ArticleEntity> | 'all';
export type AppAbility = MongoAbility<[action, Subjects]>;
