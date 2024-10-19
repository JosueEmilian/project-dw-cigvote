import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CandidateController],
  providers: [CandidateService],
  imports: [AuthModule]
})
export class CandidateModule {}
