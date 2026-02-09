import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects,MongoAbility} from '@casl/ability';
import {Injectable} from "@nestjs/common"
export enum action{
    Manage = 'manage',  
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',  
}
export enum role{
    Admin='admin',
    Doctor='doctor',
    Patient='patient',
}
//  import { User } from '../users/entities/user.entity';
// like infraSubjects <typeof userEntity | typeof patienEntity>
export type Subjects = InferSubjects<any> | 'all';
export type AppAbility=MongoAbility<[action,Subjects]>
@Injectable()
export class CaslAbilityFactory{
    // import User type from user entity
    // user:User
    createForUser(user:any){
        const{can,cannot,build}=new AbilityBuilder<AppAbility>(createMongoAbility)
    if(user.role===role.Admin){
        can(action.Manage,'all')
    }else{
        can(action.Read,'all')
        // here you can add more specific rules for Doctor and Patient roles
        // example: can(action.Update,'Appointment',{doctorId:user.id}),cannot(action.Delete,'User').because('You cannot delete users only admins can   ')

    }
    return build({detectSubjectType:item=>item.constructor as ExtractSubjectType<Subjects>
    })  
}

}