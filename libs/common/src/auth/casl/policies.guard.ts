import {  CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CheckPoliciesKey,  PolicyHandler } from './check-policies.decorator';
import { CaslAbilityFactory } from "./casl-ability.factory";

@Injectable()

@Injectable()
export class Guard implements CanActivate {
    constructor(private reflactor:Reflector,
        private caslAbilityFactory:CaslAbilityFactory
    ) {}    
 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const Policyhandlers=this.reflactor.get<PolicyHandler[]>(CheckPoliciesKey,context.getHandler()) ||[];
const{user}=context.switchToHttp().getRequest();
const ability=this.caslAbilityFactory.createForUser(user);
return Policyhandlers.every((handler) =>
      typeof handler === 'function' ? handler(ability) : handler.handle(ability),
    );
   ;
  }
}
 {

 }