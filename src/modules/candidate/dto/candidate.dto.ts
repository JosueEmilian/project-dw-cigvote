import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsPositive
} from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({
    type: 'string',
    description: '',
    example: 'Josue Emilian',
  })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({
    type: 'number',
    description: '',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  campaignid: number;

  @ApiProperty({
    type: 'text',
    description: '',
    example: 'Ingeniero en Sistemas',
  })
  @IsOptional()
  @IsString()
  description: string;
}

export class ResponseCandidates {
  @ApiProperty({
    type: 'string',
    description: '',
    example: 'e8443d1e-27a7-49d9-ab1e-2c1d76a879d0',
  })
  candidateid: string;

  @ApiProperty({
    type: 'string',
    description: '',
    example: 'Josue Emilian',
  })
  fullname: string;

  @ApiProperty({
    type: 'text',
    description: '',
    example: 'Ingeniero en Sistemas',
  })
  description: string;

  @ApiProperty({
    type: 'number',
    description: '',
    example: '1',
  })
  campaignid: number;

  @ApiProperty({
    type: 'string',
    description: '',
    example: 'Campaña de Ingenieros 1',
  })
  campaing: string;
}

export class Candidate {
  @ApiProperty({
    type: 'string',
    description: '',
    example: 'e8443d1e-27a7-49d9-ab1e-2c1d76a879d0',
  })
  candidateid: string;

  @ApiProperty({
    type: 'string',
    description: '',
    example: 'Josue Emilian',
  })
  fullName: string;

  @ApiProperty({
    type: 'text',
    description: '',
    example: 'Ingeniero en Sistemas',
  })
  description: string;

  @ApiProperty({
    type: 'number',
    description: 'Votes count',
    example: '125',
  })
  votesCount: number;
}


export class ResponseCandidatesByCampaign {

  @ApiProperty({
    type: 'string',
    description: '',
    example: 1,
  })
  campaignId: number;

  @ApiProperty({
    type: 'string',
    description: '',
    example: 'Campaña de Ingenieros 1',
  })
  title: string;

  @ApiProperty({
    type: 'text',
    description: '',
    example: 'Campaña para Ingenieros en Sistemas',
  })
  description: string;

  @ApiProperty({
    type: 'boolean',
    description: '',
    example: true,
  })
  isVotingEnabled: boolean;

  @ApiProperty({
    type: [Candidate],
    description: '',
  })
  candidates: Candidate[];
}




export class updateCandidateDto extends PartialType(CreateCandidateDto) {}