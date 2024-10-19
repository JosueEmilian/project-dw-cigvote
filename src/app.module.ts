import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VotesModule } from './modules/votes/votes.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { CandidateModule } from './modules/candidate/candidate.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity.js'],
    }),

    CampaignModule,

    CandidateModule,

    UsersModule,

    VotesModule,

    AuthModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
