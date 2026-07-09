import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { ChangePasswordDto, CreateUserDto, QueryUserDto, UpdateUserDto } from './dto/user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Список пользователей' })
  findAll(@Query() q: QueryUserDto) {
    return this.users.findAll(q);
  }

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Создать пользователя (только суперадмин)' })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Изменить пользователя (роль — только суперадмин)' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() actor: JwtUser) {
    return this.users.update(id, dto, actor);
  }

  @Patch(':id/password')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Сбросить пароль (только суперадмин)' })
  setPassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.users.setPassword(id, dto.password);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Удалить пользователя (только суперадмин)' })
  remove(@Param('id') id: string, @CurrentUser() actor: JwtUser) {
    return this.users.remove(id, actor);
  }
}
