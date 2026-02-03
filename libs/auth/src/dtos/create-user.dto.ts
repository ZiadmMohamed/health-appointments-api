import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Ali Mohammed',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Confirm password must match password',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([Math.random()], { message: 'Password does not match!' })
  @ValidateIf(o => o.password !== o.confirmPassword)
  confirmPassword: string;

  @ApiProperty({
    example: '01234567890',
    description: 'Phone number of the user, max 11 characters',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  phone: string;

  @ApiProperty({
    example: 'male',
    description: 'Gender of the user, either male or female',
    enum: ['male', 'female'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['male', 'female'])
  Gender: 'male' | 'female';
}
