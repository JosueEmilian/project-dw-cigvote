import {
  Get,
  Put,
  Body,
  Param,
  Delete,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';

import { 
  ApiTags,
  ApiResponse,
  ApiOperation
} from '@nestjs/swagger';

import { Auth } from '../auth/decorators';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Users')
@Controller('user')
// @Auth(ValidRoles.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search/:term')
  @ApiOperation({
    summary: 'Get a user by DPI, Registration Number, or Full Name',
  })
  @ApiResponse({
    status: 200,
    description:
      'Permite buscar por DPI, por Número de colegiado y por su Nombre Completo',
  })
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a user by uuid' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a user by uuid' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}