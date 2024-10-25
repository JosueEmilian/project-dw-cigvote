import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { 
  Role, 
  User, 
  User_Role 
} from 'src/common/entities';
import { META_ROLES } from '../../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );


    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const qb = await this.dataSource
      .createQueryBuilder()
      .select(['r.rolename AS "roleName"'])
      .from(User_Role, 'ur')
      .innerJoin(Role, 'r', 'ur.roleId = r.roleId')
      .where('ur.userId = :userId', { userId: user.userid })
      .getRawMany();

    const userRoles = qb.map((role) => role.roleName);

    for (const role of userRoles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have permission to access this route',
    );
  }
}
