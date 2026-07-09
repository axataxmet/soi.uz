import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, QueryDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Список документов' })
  findAll(@Query() q: QueryDocumentDto) {
    return this.documents.findAll(q);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documents.findOne(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateDocumentDto) {
    return this.documents.createDocument(dto);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.documents.updateDocument(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.documents.remove(id);
  }
}
