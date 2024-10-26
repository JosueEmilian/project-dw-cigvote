import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'The user registration number',
    example: '949021460',
  })
  @IsNotEmpty()
  @IsString()
  registrationnumber: string;

  @ApiProperty({
    type: 'string',
    description: 'The user full name',
    example: 'Josue Emiliano Uyu',
  })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({
    type: 'string',
    description: 'The user email',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'The user DPI',
    example: '1234567891023',
  })
  @IsNotEmpty()
  @IsNumber()
  dpi: string;

  @ApiProperty({
    type: 'date',
    description: 'The user birthdate',
    example: '2001-03-25',
  })
  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  @ApiProperty({
    type: 'string',
    description: 'The user password',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(88)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
