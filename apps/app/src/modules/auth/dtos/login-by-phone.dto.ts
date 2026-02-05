import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginByPhoneDto {
  @ApiProperty({
    example: '01234567890',
    description: 'Phone number of the user used for login',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password for the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
