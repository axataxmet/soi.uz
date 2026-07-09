import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RegDocumentsService } from './reg-documents.service';
import { CreateRegDocumentDto, UpdateRegDocumentDto } from './dto/reg-document.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('products')
@Controller('products')
export class RegDocumentsController {
  constructor(private readonly docs: RegDocumentsService) {}

  @Public()
  @Get(':productId/reg-documents')
  @ApiOperation({ summary: 'Регуляторные документы товара (РУ/CE/ISO/…)' })
  findAll(@Param('productId') productId: string) {
    return this.docs.findAll(productId);
  }

  @Post(':productId/reg-documents')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Param('productId') productId: string, @Body() dto: CreateRegDocumentDto) {
    return this.docs.create(productId, dto);
  }

  @Patch('reg-documents/:id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateRegDocumentDto) {
    return this.docs.update(id, dto);
  }

  @Delete('reg-documents/:id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.docs.remove(id);
  }
}
