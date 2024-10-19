import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/common/entities/campaign.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CampaignController],
  providers: [CampaignService],
  imports: [
    AuthModule
  ]
})
export class CampaignModule {}
