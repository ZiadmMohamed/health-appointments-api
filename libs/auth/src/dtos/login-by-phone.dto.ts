import { IsEmail, IsIn, IsNotEmpty, IsString, max, maxLength, min, minLength, validate, ValidateIf } from "class-validator";

export class LoginByPhoneDto {
    @IsString()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}