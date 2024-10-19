import {
  Column,
  Entity,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User_Role } from './userRole.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userid: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  registrationnumber: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fullname: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 13, unique: true, nullable: false })
  dpi: string;

  @Column({ type: 'date', nullable: false })
  birthdate: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'boolean', default: true })
  isactive: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdat: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedat: Date;

  @OneToMany(() => User_Role, (userRole) => userRole.user)
  userRoles: User_Role[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}