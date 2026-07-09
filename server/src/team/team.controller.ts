import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { TeamService } from './team.service';
import { CreateTeamMemberDto, QueryTeamDto, UpdateTeamMemberDto } from './dto/team.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly team: TeamService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Команда' })
  findAll(@Query() q: QueryTeamDto) {
    return this.team.findAll(q);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.team.findOne(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateTeamMemberDto) {
    return this.team.createMember(dto);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.team.updateMember(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.team.remove(id);
  }
}
