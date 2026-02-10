import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginByEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address used for login',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password for the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
