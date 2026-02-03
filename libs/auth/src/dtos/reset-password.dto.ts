import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'f4e1b2c3-5678-90ab-cdef-1234567890ab',
    description: 'Token sent to user for resetting the password',
  })
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @ApiProperty({
    example: 'NewStrongP@ssw0rd',
    description: 'The new password for the user',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    example: 'NewStrongP@ssw0rd',
    description: 'Confirm password must match the new password',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([Math.random()], { message: 'Password does not match!' })
  @ValidateIf(o => o.newPassword !== o.confirmPassword)
  confirmPassword: string;
}
