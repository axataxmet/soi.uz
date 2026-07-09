import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CasesService } from './cases.service';
import { CreateCaseDto, QueryCaseDto, UpdateCaseDto } from './dto/case.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly cases: CasesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Опубликованные кейсы (публичный)' })
  findPublic(@Query() q: QueryCaseDto) {
    return this.cases.findPublic(q);
  }

  @Get('manage/all')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  findAllAdmin(@Query() q: QueryCaseDto) {
    return this.cases.findAllAdmin(q);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cases.findOnePublic(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateCaseDto, @CurrentUser('role') role: Role) {
    return this.cases.createCase(dto, role);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateCaseDto, @CurrentUser('role') role: Role) {
    return this.cases.updateCase(id, dto, role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.cases.remove(id);
  }
}
