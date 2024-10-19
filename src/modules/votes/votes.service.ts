import {
  Logger,
  HttpStatus,
  Injectable,
  HttpException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { CreateVoteDto } from './dto/votes.dto';
import { CampaignResult } from './interface/votes.interface';
import { Campaign, Candidate, Vote } from 'src/common/entities';

@Injectable()
export class VotesService {
  private readonly logger = new Logger(VotesService.name);

  constructor(private readonly dataSource: DataSource) {}

  private async hasUserVotedInCampaign(
    userId: string,
    campaignId: number,
  ): Promise<boolean> {
    const existingVote = await this.dataSource
      .getRepository(Vote)
      .createQueryBuilder('v')
      .where('v.userid = :userid', { userid: userId })
      .andWhere('v.campaignid = :campaignid', { campaignid: campaignId })
      .getOne();

    return !!existingVote;
  }

  private async isCandidateInCampaign(
    candidateId: string,
    campaignId: number,
  ): Promise<boolean> {
    const candidate = await this.dataSource
      .getRepository(Candidate)
      .createQueryBuilder('candidate')
      .where('candidate.candidateid = :candidateid', {
        candidateid: candidateId,
      })
      .andWhere('candidate.campaignid = :campaignid', {
        campaignid: campaignId,
      })
      .getOne();

    return !!candidate;
  }

  async create(
    createVote: CreateVoteDto,
    uuiduser: string,
  ): Promise<{ message: string }> {
    try {
      const hasVoted = await this.hasUserVotedInCampaign(
        uuiduser,
        createVote.campaignid,
      );

      if (hasVoted) {
        throw new ConflictException('You have already voted in this campaign.');
      }

      const isCandidateValid = await this.isCandidateInCampaign(
        createVote.candidateid,
        createVote.campaignid,
      );

      if (!isCandidateValid) {
        throw new BadRequestException(
          'The candidate does not belong to the specified campaign.',
        );
      }

      const campaign = await this.dataSource
        .getRepository(Campaign)
        .findOne({ where: { campaignid: createVote.campaignid } });

      if (!campaign) {
        throw new NotFoundException('Campaign not found.');
      }

      if (!campaign.isvotingenabled) {
        throw new BadRequestException(
          'Voting is not enabled for this campaign.',
        );
      }

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Vote)
        .values({
          userid: uuiduser,
          ...createVote,
        })
        .execute();

      return {
        message: 'Vote created successfully',
      };
    } catch (error) {
      this.logger.error(`Error creating vote: ${error.message}`, error.stack);
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new HttpException(
        `Failed to create vote: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async results():Promise<CampaignResult[]> {
    try {
      const resultsVotes = await this.dataSource
        .createQueryBuilder()
        .select([
          'ca.title as "campaignTitle"',
          'ca.description as "campaignDescription"',
          'c.fullname as "candidateName"',
          'COUNT(v.voteid) as totalVotes',
        ])
        .from(Campaign, 'ca')
        .innerJoin(Candidate, 'c', 'ca.campaignId = c.campaignId')
        .leftJoin(Vote, 'v', 'c.candidateId = v.candidateId')
        .groupBy('ca.title, ca.description, c.fullName')
        .orderBy('ca.title', 'ASC')
        .addOrderBy('totalVotes', 'DESC')
        .getRawMany();

      const formattedData:CampaignResult[] = resultsVotes.reduce((acc, result) => {
        const campaignIndex = acc.findIndex(
          (item) => item.campaignTitle === result.campaignTitle,
        );

        const candidate = {
          candidateName: result.candidateName,
          totalVotes: parseInt(result.totalvotes, 10),
        };

        if (campaignIndex > -1) {
          acc[campaignIndex].candidates.push(candidate);
        } else {
          acc.push({
            campaignTitle: result.campaignTitle,
            campaignDescription: result.campaignDescription,
            candidates: [candidate],
          });
        }
        return acc;
      }, []);

      return formattedData;
    } catch (error) {
      this.logger.error(`Error fetching votes: ${error.message}`, error.stack);
      throw new HttpException(
        `Failed to fetch votes: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async closeVoting(): Promise<{ results: CampaignResult[] }> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .update(Campaign)
        .set({ isvotingenabled: false })
        .execute();

      const votingResults =  await this.results();
      return {
        results: votingResults,
      };

    } catch (error) {
      this.logger.error(`Error closing voting: ${error.message}`, error.stack);
      throw new HttpException(
        `Failed to close voting: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}