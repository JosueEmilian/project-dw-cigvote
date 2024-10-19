import { 
  Put,
  Get, 
  Post, 
  Body,
  Param, 
  Delete, 
  Controller
} from '@nestjs/common';

import { 
  ApiTags, 
  ApiParam,
  ApiResponse,
  ApiOperation
} from '@nestjs/swagger';

import { 
  UpdateCampaignDto, 
  CreateCampaignDto, 
  ResponseCampaignsDto, 
} from './dto/create-campaign.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { CampaignService } from './campaign.service';

@ApiTags('Campaigns')
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  // @Auth(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  async create(@Body() createCampaign: CreateCampaignDto) {
    const result = await this.campaignService.create(createCampaign);
    return result;
  }

  @Get()
  // @Auth(ValidRoles.ADMIN, ValidRoles.USER)
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({
    status: 200,
    description: 'Campaigns retrieved successfully',
    type: ResponseCampaignsDto,
    isArray: true,
  })
  async findAll() {
    const result = await this.campaignService.findAll();
    return result;
  }

  @Get('/:id')
  // @Auth(ValidRoles.ADMIN, ValidRoles.USER)
  @ApiOperation({ summary: 'Get a campaign by id' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Campaign retrieved successfully' })
  async findOne(@Param('id') id: number) {
    const result = await this.campaignService.findOne(id);
    return result;
  }

  @Put('/:id')
  // @Auth(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Update a campaign by id' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully' })
  async update(
    @Param('id') id: number,
    @Body() updateCampaign: UpdateCampaignDto,
  ) {
    const result = await this.campaignService.update(id, updateCampaign);
    return result;
  }

  @Delete('/:id')
  // @Auth(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a campaign by id' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  async delete(@Param('id') id: number) {
    const result = await this.campaignService.remove(id);
    return result;
  }
}