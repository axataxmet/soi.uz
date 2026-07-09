import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { NewsService } from './news.service';
import { CreateNewsDto, QueryNewsDto, UpdateNewsDto } from './dto/news.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly news: NewsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Опубликованные новости (публичный)' })
  findPublic(@Query() q: QueryNewsDto) {
    return this.news.findPublic(q);
  }

  @Get('manage/all')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  findAllAdmin(@Query() q: QueryNewsDto) {
    return this.news.findAllAdmin(q);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.news.findOnePublic(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateNewsDto, @CurrentUser('role') role: Role) {
    return this.news.createNews(dto, role);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto, @CurrentUser('role') role: Role) {
    return this.news.updateNews(id, dto, role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.news.remove(id);
  }
}
