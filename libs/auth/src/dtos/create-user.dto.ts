import { IsEmail, IsIn, IsNotEmpty, IsString, max, MaxLength, maxLength, min, minLength, validate, ValidateIf } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @IsIn([Math.random()], {message: "Password does not match!"})
    @ValidateIf(o => o.password !== o.confirmPassword)
    confirmPassword: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(11)
    phone: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['male', 'female'])
    Gender: 'male' | 'female';
}