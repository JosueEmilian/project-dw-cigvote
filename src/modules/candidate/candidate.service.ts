import { Logger, HttpStatus, Injectable, HttpException } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { isUUID } from 'class-validator';
import { Campaign, Candidate, Vote } from 'src/common/entities';
import { CreateCandidateDto, updateCandidateDto } from './dto/candidate.dto';
import { CandidateList, ICandidate } from './interfaces/candidate.interface';

@Injectable()
export class CandidateService {
  private readonly logger = new Logger(CandidateService.name);

  constructor(private readonly dataSource: DataSource) {}

  async create(createCandidate: CreateCandidateDto): Promise<ICandidate> {
    try {
      const candidate = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Candidate)
        .values({
          ...createCandidate,
        })
        .returning(['candidateid'])
        .execute();

      const candidateid: number = candidate.raw[0]?.candidateid;

      return {
        message: 'Candidate created sucesfully',
        uuid: candidateid,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findAll(): Promise<CandidateList[]> {
    try {
      const candidates = await this.dataSource
        .createQueryBuilder()
        .select([
          'c.candidateid AS candidateid',
          'c.fullname AS fullname',
          'c.description AS description',
          'c.campaignid AS campaignid',
          'cp.title AS campaing',
        ])
        .from(Candidate, 'c')
        .innerJoin(Campaign, 'cp', 'c.campaignid = cp.campaignid')
        .getRawMany<CandidateList>();

      if (!candidates.length) {
        throw new HttpException('No candidates found', HttpStatus.NOT_FOUND);
      }

      return candidates;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findOne(term: string): Promise<CandidateList> {
    try {
      const candidateqb = await this.dataSource
        .createQueryBuilder()
        .select([
          'c.candidateid AS candidateid',
          'c.fullname AS fullname',
          'c.description AS description',
          'c.campaignid AS campaignid',
          'cp.title AS campaing',
        ])
        .from(Candidate, 'c')
        .innerJoin(Campaign, 'cp', 'c.campaignid = cp.campaignid');

      if (isUUID(term)) {
        candidateqb.where('c.candidateid = :term', { term });
      } else {
        candidateqb.where('c.fullname ILIKE :fullname', { fullname: term });
      }

      const candidate = await candidateqb.getRawOne<CandidateList>();

      if (!candidate) {
        throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND);
      }
      return candidate;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async update(
    id: string,
    updateCandidate: updateCandidateDto,
  ): Promise<{ message: string }> {
    try {
      const candidate = await this.findOne(id);

      if (!candidate) {
        throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND);
      }

      await this.dataSource
        .createQueryBuilder()
        .update(Candidate)
        .set({
          ...updateCandidate,
        })
        .where('candidateid = :id', { id })
        .execute();

      return { message: 'Update candidate successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error.message);
      throw new HttpException(
        'Error updating candidate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const candidate = await this.findOne(id);

      if (!candidate) {
        throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND);
      }

      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Candidate)
        .where('candidateid = :id', { id })
        .execute();

      return { message: 'Candidate removed successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error.message);
      throw new HttpException(
        'Error removing candidate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Management candidates
  async findCandidatesByCampaign(campaignId: number) {
    try {
      const qb = await this.dataSource
        .createQueryBuilder()
        .select([
          'c.campaignid AS "campaignId"',
          'c.title AS "campaignTitle"',
          'c.description AS "campaignDescription"',
          'c.isvotingenabled AS "isVotingEnabled"',
          'ca.candidateid AS "candidateid"',
          'ca.fullname AS "fullName"',
          'ca.description AS "candidateDescription"',
          'COUNT(v.voteid) AS "votesCount"',
        ])
        .from(Campaign, 'c')
        .leftJoin(Candidate, 'ca', 'c.campaignid = ca.campaignid')
        .leftJoin(Vote, 'v', 'ca.candidateid = v.candidateid')
        .where('c.campaignid = :campaignId', { campaignId })
        .groupBy('c.campaignid, ca.candidateid')
        .getRawMany();

      if (!qb.length) {
        throw new HttpException('No campaign found', HttpStatus.NOT_FOUND);
      }
      const campaign = {
        campaignId: qb[0].campaignId,
        title: qb[0].campaignTitle,
        description: qb[0].campaignDescription,
        isVotingEnabled: qb[0].isVotingEnabled,
        candidates: qb
          .filter((row) => row.candidateid)
          .map((row) => ({
            candidateid: row.candidateid,
            fullName: row.fullName,
            description: row.candidateDescription,
            votesCount: parseInt(row.votesCount, 10),
          })),
      };

      return campaign;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
