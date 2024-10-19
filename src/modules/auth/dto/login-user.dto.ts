import { ApiProperty } from '@nestjs/swagger';
import {
  Matches,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsDateString,
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
  @IsString()
  @MinLength(13)
  @MaxLength(13)
  @Matches(/^\d+$/, { message: 'DPI must contain only numbers' })
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
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak. Must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
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