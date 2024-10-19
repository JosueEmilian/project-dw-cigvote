import { 
  Injectable, 
  UnauthorizedException
} from '@nestjs/common';

import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from 'src/common/entities';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;

    const user = await this.userRepository.findOneBy({ userid: id });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    if (!user.isactive) {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }
}
