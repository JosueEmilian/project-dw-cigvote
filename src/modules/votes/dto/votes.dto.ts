import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsInt, 
  IsUUID, 
  IsNotEmpty, 
  IsPositive, 
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