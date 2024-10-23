import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsInt, 
  IsUUID, 
  IsNotEmpty, 
  IsPositive,
  IsBoolean,
  IsString,
  IsArray, 
} from 'class-validator';

export class CreateVoteDto {
  @ApiProperty({
    type: 'uuid',
    description: 'The candidate id of the vote',
    example: 'd58e567d-b277-483c-85fe-d8e1822fc1e0',
  })
  @IsNotEmpty()
  @IsUUID()
  candidateid: string;

  @ApiProperty({
    type: 'bigint',
    description: 'The campaign id of the vote',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  campaignid: number;
}

export class ToggleVotingDto {
  @ApiProperty({
    type: 'boolean',
    description: 'Enable or disable voting',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  enableVoting: boolean;
}

export class CandidateResultDto {
  @ApiProperty({
    description: 'The name of the candidate',
    example: 'Valeria Lou',
  })
  candidateName: string;

  @ApiProperty({
    description: 'The description or profession of the candidate',
    example: 'Ingeniera en Sistemas',
  })
  candidateDescription: string;

  @ApiProperty({
    description: 'The total number of votes received by the candidate',
    example: 3,
  })
  totalVotes: number;
}

export class CampaignResultDto {
  @ApiProperty({
    description: 'The title of the campaign',
    example: 'My Campaign',
  })
  campaignTitle: string;

  @ApiProperty({
    description: 'A brief description of the campaign',
    example: 'This is a campaign description',
  })
  campaignDescription: string;

  @ApiProperty({
    type: [CandidateResultDto],
    description: 'List of candidates associated with the campaign and their vote results',
  })
  candidates: CandidateResultDto[];
}

export class ToggleVotingResponseDto {
  @ApiProperty({
    description: 'Message indicating the status of the voting',
    example: 'Voting has been disabled, here are the final results.',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    type: [CampaignResultDto],
    description: 'Results of the voting campaigns',
  })
  @IsArray()
  results: CampaignResultDto[];
}