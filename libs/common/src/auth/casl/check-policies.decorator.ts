import { SetMetadata } from "@nestjs/common";
import { AppAbility } from "./casl-ability.factory";
export interface IPolicyHandler{
    handle(ability:AppAbility):boolean
}
 export const CheckPoliciesKey='check_policies';
type PolicyHandlerCallback=(ability:AppAbility)=>boolean;
export type PolicyHandler=IPolicyHandler | PolicyHandlerCallback;
export const CheckPolicies=(...handlers: PolicyHandler[])=>SetMetadata(CheckPoliciesKey, handlers);

