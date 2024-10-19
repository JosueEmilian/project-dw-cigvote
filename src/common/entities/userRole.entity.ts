import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('User_Role')
export class User_Role {
  @PrimaryGeneratedColumn()
  userroleid: number;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleid' })
  role: Role;
}