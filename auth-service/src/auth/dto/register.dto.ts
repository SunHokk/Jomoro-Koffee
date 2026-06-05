import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]+$/, { message: 'First name must contain letters only' })
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]+$/, { message: 'Last name must contain letters only' })
  last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @Matches(/^[^\s]*$/, { message: 'Password cannot contain spaces' })
  @Matches(/(?:.*\d){2}/, { message: 'Password must contain at least 2 numeric digits' })
  password: string;
}