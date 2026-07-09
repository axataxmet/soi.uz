import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { SubmissionsService } from './submissions.service';
import {
  CreateSubmissionDto,
  QuerySubmissionDto,
  UpdateSubmissionStatusDto,
} from './dto/submission.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

// Заявки клиентов: создание — публично (форма на сайте), управление — только менеджер заявок/админ.
const MANAGE_ROLES = [Role.ADMIN, Role.SUBMISSIONS_MANAGER];

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Public()
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Оставить заявку (публичный)' })
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissions.createSubmission(dto);
  }

  @Public()
  @Post('attachments')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить вложения формы (публичный) — PDF/DOC/DOCX/XLSX/JPG/PNG' })
  uploadAttachments(@UploadedFiles() files: Express.Multer.File[]) {
    return this.submissions.uploadAttachments(files);
  }

  @Get()
  @Roles(...MANAGE_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Список заявок (менеджер)' })
  findAll(@Query() q: QuerySubmissionDto) {
    return this.submissions.findAll(q);
  }

  @Get(':id')
  @Roles(...MANAGE_ROLES)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.submissions.findOne(id);
  }

  @Patch(':id')
  @Roles(...MANAGE_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Сменить статус заявки' })
  setStatus(@Param('id') id: string, @Body() dto: UpdateSubmissionStatusDto) {
    return this.submissions.setStatus(id, dto.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.submissions.remove(id);
  }
}
