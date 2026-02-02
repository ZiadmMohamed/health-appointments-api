import { IsEmail, IsIn, IsNotEmpty, IsString, max, maxLength, min, minLength, validate, ValidateIf } from "class-validator";

export class LoginByEmailDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}