import {
  Get,
  Put,
  Post,
  Body,
  Controller,
} from '@nestjs/common';

import { 
  ApiTags,
  ApiBody,
  ApiResponse, 
  ApiOperation,
} from '@nestjs/swagger';
import { User } from 'src/common/entities';
import { VotesService } from './votes.service';
import { 
  CreateVoteDto, 
  ToggleVotingDto, 
  CampaignResultDto, 
  ToggleVotingResponseDto } from './dto/votes.dto';
  import { ValidRoles } from '../auth/interfaces';
  import { Auth, GetUser } from '../auth/decorators';

@ApiTags('Vote Management')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @Auth(ValidRoles.USER, ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new vote' })
  @ApiResponse({
    status: 201,
    description: 'The vote has been successfully created.',
  })
  create(@Body() createVoteDto: CreateVoteDto, @GetUser() user: User) {
    return this.votesService.create(createVoteDto, user.userid);
  }

  @Get('results')
  @Auth(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Get all votes' })
  @ApiResponse({
    status: 200,
    description: 'Returns all votes.',
    type: [CampaignResultDto]
  })
  findAll() {
    return this.votesService.results();
  }

  @Put('close-voting')
  @Auth(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Close voting and get the results' })
  @ApiBody({ type: ToggleVotingDto })
  @ApiResponse({
    status: 200,
    description: 'Return results of the voting',
    type: ToggleVotingResponseDto
  })
  @ApiResponse({
    status: 204,
    description: 'Voting has been enabled; no results to return.',
  })
  async toggleVoting(@Body() enableVoting: ToggleVotingDto) {
    return this.votesService.toggleVoting(enableVoting);
  }
}
