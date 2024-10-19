import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'Candidate' })
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  candidateid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fullname: string;

  @Column({type: 'bigint', nullable: false })
  campaignid: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdat: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedat: Date;
}
