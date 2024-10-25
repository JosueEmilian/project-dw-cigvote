import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

export class LoginUserDto {
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
  password: string;
}

export class ResponseAuth {
  @ApiProperty({
    type: String,
    description: 'The user token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  token: string;
}
