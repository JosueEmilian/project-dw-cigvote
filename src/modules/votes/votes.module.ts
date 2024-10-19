import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [VotesController],
  providers: [VotesService],
  imports: [AuthModule]
})
export class VotesModule {}
