import {
  Logger,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Role, User, User_Role } from 'src/common/entities';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IResponseUser, JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(User_Role)
    private readonly userRoleRepository: Repository<User_Role>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUser: CreateUserDto): Promise<IResponseUser> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const defaultRoleName = this.configService.get<string>('DEFAULT_ROLE');

      const { password, ...userData } = createUser;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      await queryRunner.manager.save(user);

      const defaultRole = await queryRunner.manager.findOne(Role, {
        where: { rolename: defaultRoleName },
      });
      if (!defaultRole) {
        throw new InternalServerErrorException('Default role not found');
      }

      const userRole = this.userRoleRepository.create({
        user: user,
        role: defaultRole,
      });
      await queryRunner.manager.save(userRole);

      await queryRunner.commitTransaction();

      return {
        token: this.getJwtToken({
          id: user.userid,
          username: user.fullname,
          email: user.email,
          rol: defaultRole.roleid,
        }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginUser: LoginUserDto) {
    try {
      const { registrationnumber, dpi, birthdate, password } = loginUser;

      const user = await this.userRepository.findOne({
        where: { registrationnumber, dpi, birthdate },
        select: { fullname: true, email: true, password: true, userid: true },
      });

      const role = await this.userRoleRepository.findOne({
        where: { user: user },
        relations: ['role'],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        token: this.getJwtToken({
          id: user.userid,
          username: user.fullname,
          email: user.email,
          rol: role.role.roleid,
        }),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async checkAuthStatus(user: User) {
    return {
      token: this.getJwtToken({
        id: user.userid,
        username: user.fullname,
        email: user.email,
        rol: user.userRoles[0].role.roleid,
      }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Error creating user, observe the logs',
    );
  }
}
