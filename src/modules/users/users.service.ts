import { 
  Logger,
  HttpStatus, 
  Injectable, 
  HttpException, 
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { isUUID } from 'class-validator';
import { User } from 'src/common/entities';
import { UpdateUserDto } from './dto/user.dto';
import { UserList } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly dataSource: DataSource) {}

  async findAll(): Promise<UserList[]> {
    try {
      const users = await this.dataSource
        .createQueryBuilder()
        .select([
          'u.userid as userid',
          'u.registrationnumber as registrationnumber',
          'u.fullname as fullname',
          'u.email as email',
          'u.dpi as dpi',
          'u.birthdate as birthdate',
        ])
        .from(User, 'u')
        .getRawMany<UserList>();

      return users;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findOne(term: string): Promise<UserList> {
    try {
      const userqb = this.dataSource
        .createQueryBuilder()
        .select([
          'u.userid as userid',
          'u.registrationnumber as registrationnumber',
          'u.fullname as fullname',
          'u.email as email',
          'u.dpi as dpi',
          'u.birthdate as birthdate',
        ])
        .from(User, 'u');

      if (isUUID(term)) {
        userqb.where('u.userid = :term', { term });
      } else {
        userqb
          .where('u.registrationnumber = :term', { term })
          .orWhere('u.fullname ILIKE :fullname', { fullname: `%${term}%` })
          .orWhere('u.dpi = :term', { term });
      }

      const user = await userqb.getRawOne<UserList>();

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error finding user with term ${term}: ${error.message}`,
      );
      throw new HttpException(
        'Error finding user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set({
          ...updateUserDto,
        })
        .where('userid = :id', { id })
        .execute();

      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error.message);
      throw new HttpException(
        'Error updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('userid = :id', { id })
        .execute();

      return { message: 'User removed successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error.message);
      throw new HttpException(
        'Error removing user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}