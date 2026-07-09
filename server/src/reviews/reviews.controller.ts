import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

const CONTENT_ROLES = [Role.ADMIN, Role.EDITOR, Role.CONTENT_MANAGER];

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  // Public site — published only.
  @Public()
  @Get()
  @ApiOperation({ summary: 'Список опубликованных отзывов (публичный)' })
  findPublic(@Query() q: QueryReviewDto) {
    return this.reviews.findPublic(q);
  }

  // Admin list — all statuses (declared before :id to avoid capture).
  @Get('manage/all')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Список всех отзывов (админ)' })
  findAllAdmin(@Query() q: QueryReviewDto) {
    return this.reviews.findAllAdmin(q);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Один опубликованный отзыв' })
  findOne(@Param('id') id: string) {
    return this.reviews.findOnePublic(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать отзыв' })
  create(@Body() dto: CreateReviewDto, @CurrentUser('role') role: Role) {
    return this.reviews.create(dto, role);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить отзыв' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto, @CurrentUser('role') role: Role) {
    return this.reviews.update(id, dto, role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить отзыв' })
  remove(@Param('id') id: string) {
    return this.reviews.remove(id);
  }
}
