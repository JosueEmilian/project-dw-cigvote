import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  Matches,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'The user registration number',
    example: '201701001',
  })
  @IsNotEmpty()
  @IsString()
  registrationnumber: string;

  @ApiProperty({
    type: 'string',
    description: 'The user full name',
    example: 'Juan Perez',
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
    example: '4898098760110',
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

export class UpdateUserDto extends PartialType(CreateUserDto) {}
