import { 
  Column, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn
 } from 'typeorm';
import { User_Role } from './userRole.entity';

@Entity({ name: 'Role' })
export class Role {
  @PrimaryGeneratedColumn()
  roleid: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  rolename: string;

  @OneToMany(() => User_Role, (userRole) => userRole.role)
  userRoles: User_Role[];
}