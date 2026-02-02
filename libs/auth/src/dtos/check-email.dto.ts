import { IsEmail, IsIn, IsNotEmpty, IsString, max, MaxLength, maxLength, min, minLength, validate, ValidateIf } from "class-validator";

export class CheckEmailDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}