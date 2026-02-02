import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength, ValidateIf } from "class-validator";

export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}
