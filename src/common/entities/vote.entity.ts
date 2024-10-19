import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Vote' })
export class Vote {
  @PrimaryGeneratedColumn()
  voteid: string;

  @Column({ type: 'uuid', nullable: false })
  userid: string;

  @Column({ type: 'uuid', nullable: false })
  candidateid: string;

  @Column({ type: 'bigint', nullable: false })
  campaignid: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  votedate: Date;
}