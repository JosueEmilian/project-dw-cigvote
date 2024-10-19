import {
  Get,
  Post,
  Body,
  Controller,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiResponse, 
} from '@nestjs/swagger';

import { User } from 'src/common/entities';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto, ResponseAuth } from './dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User created successfully', type: ResponseAuth})
  create(@Body() createUser: CreateUserDto) {
    return this.authService.create(createUser);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: ResponseAuth})
  login(@Body() loginUser: LoginUserDto) {
    return this.authService.login(loginUser);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }
}
