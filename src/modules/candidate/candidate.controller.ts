import {
  Put,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiParam, 
  ApiResponse, 
  ApiOperation, 
} from '@nestjs/swagger';
import { 
  updateCandidateDto,
  CreateCandidateDto,
  ResponseCandidates, 
  ResponseCandidatesByCampaign, 
} from './dto/candidate.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { CandidateService } from './candidate.service';

@ApiTags('Candidates')
@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post()
  @Auth(ValidRoles.ADMIN)  
  @ApiOperation({ summary: 'Create a new candidate' })
  @ApiResponse({ status: 201, description: 'Candidate created successfully' })
  create(@Body() createCandidate: CreateCandidateDto) {
    return this.candidateService.create(createCandidate);
  }

  @Get()
  @Auth(ValidRoles.ADMIN, ValidRoles.USER)
  @ApiOperation({ summary: 'Get all candidates' })
  @ApiResponse({
    status: 200,
    description: 'Candidates retrieved successfully',
    type: [ResponseCandidates]
  })
  findAll() {
    return this.candidateService.findAll();
  }

  // Management candidates
  @Get('by-campaign/:campaignId')
  @Auth(ValidRoles.ADMIN, ValidRoles.USER)
  @ApiOperation({ summary: 'Get all candidates by campaign' })
  @ApiParam({ name: 'campaignId', type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Candidates retrieved successfully',
    type: ResponseCandidatesByCampaign
  })
  findByCampaign(@Param('campaignId') campaignId: number) {
    return this.candidateService.findCandidatesByCampaign(campaignId);
  }

  @Get('search/:term')
  @Auth(ValidRoles.ADMIN, ValidRoles.USER)
  @ApiOperation({ summary: 'Get a candidate by UUID and FullName' })
  @ApiResponse({
    status: 200,
    description: 'Permite buscar por UUID y por Nombre Completo',
  })
  findOne(@Param('term') term: string) {
    return this.candidateService.findOne(term);
  }

  @Put(':uuid')
  @Auth(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Update a candidate by UUID' })
  @ApiParam({ name: 'uuid', type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Candidate updated successfully' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateCandidate: updateCandidateDto,
  ) {
    return this.candidateService.update(uuid, updateCandidate);
  }

  @Delete(':uuid')
  @Auth(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a candidate by UUID' })
  @ApiResponse({ status: 200, description: 'Candidate deleted successfully' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.candidateService.remove(uuid);
  }
}