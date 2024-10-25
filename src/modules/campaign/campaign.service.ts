import { Logger, HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Campaign } from 'src/common/entities';
import { ICampaign, CampaignList } from './interface/campaign.interface';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
} from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(private readonly dataSource: DataSource) {}

  async create(createCampaign: CreateCampaignDto): Promise<ICampaign> {
    try {
      const campaing = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Campaign)
        .values({
          ...createCampaign,
        })
        .returning(['campaignid'])
        .execute();

      const id: number = campaing.raw[0]?.campaignid;
      return {
        message: 'Campaign created successfully',
        id: id,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findAll(): Promise<CampaignList[]> {
    try {
      const campaigns = await this.dataSource
        .createQueryBuilder()
        .select([
          'c.campaignid as campaignid',
          'c.title as title',
          'c.description as description',
          'c.isvotingenabled as isVotingEnabled',
        ])
        .from(Campaign, 'c')
        .orderBy('c.campaignid')
        .getRawMany<CampaignList>();

      return campaigns;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findOne(id: number): Promise<CampaignList> {
    try {
      const campaign = await this.dataSource
        .createQueryBuilder()
        .select([
          'c.campaignid as campaignid',
          'c.title as title',
          'c.description as description',
          'c.isvotingenabled as isVotingEnabled',
        ])
        .from(Campaign, 'c')
        .where('c.campaignid = :id', { id })
        // .andWhere('c.isvotingenabled = :isActive', { isActive: true })
        .getRawOne<CampaignList>();

      if (!campaign) {
        throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
      }
      return campaign;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async update(
    id: number,
    updateCampaing: UpdateCampaignDto,
  ): Promise<{ message: string }> {
    try {
      const campaign = await this.findOne(id);

      if (!campaign) {
        throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
      }

      await this.dataSource
        .createQueryBuilder()
        .update(Campaign)
        .set({
          ...updateCampaing,
        })
        .where('campaignid = :id', { id })
        .execute();

      return {
        message: 'Updated sucesfully!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error.message);
      throw new HttpException(
        'Error updating campaign',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const campaign = await this.findOne(id);

      if (!campaign) {
        throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
      }

      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Campaign, 'c')
        .where('campaignid = :id', { id })
        .execute();

      return {
        message: 'Campaign removed successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error.message);
      throw new HttpException(
        'Error removing campaign',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
