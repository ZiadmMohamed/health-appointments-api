import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginByPhoneDto {
  @ApiProperty({
    example: '01234567890',
    description: 'Phone number of the user used for login',
  })
  @IsString()
  @IsPhoneNumber()
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
