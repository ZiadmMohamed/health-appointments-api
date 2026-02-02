import { IsEmail, IsIn, IsNotEmpty, IsString, max, MaxLength, maxLength, min, minLength, validate, ValidateIf } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    resetToken: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @IsIn([Math.random()], {message: "Password does not match!"})
    @ValidateIf(o => o.newPassword !== o.confirmPassword)
    confirmPassword: string;
}