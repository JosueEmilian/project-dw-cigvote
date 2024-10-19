import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Campaign' })
export class Campaign {
  @PrimaryGeneratedColumn()
  campaignid: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bool', nullable: false })
  isvotingenabled: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdat: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedat: Date;
}