import { 
  ApiProperty, 
  PartialType
} from '@nestjs/swagger';
import { 
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({
    type: String,
    description: 'The title of the campaign',
    example: 'My Campaign',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'The description of the campaign',
    example: 'This is a campaign description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether voting is enabled for the campaign',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isvotingenabled: boolean;
}

export class ResponseCampaignsDto {
  @ApiProperty({
    type: 'number',
    description: 'The campaign id',
    example: 1
  })
  campaignid: number;

  @ApiProperty({
    type: String,
    description: 'The title of the campaign',
    example: 'My Campaign',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'The description of the campaign',
    example: 'This is a campaign description'
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether voting is enabled for the campaign',
    example: true,
  })
  isvotingenabled: boolean;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto){}