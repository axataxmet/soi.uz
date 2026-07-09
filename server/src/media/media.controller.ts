import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post('upload')
  @Roles(...CONTENT_ROLES)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Загрузить файл в MinIO, вернуть URL' })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 15 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser('userId') userId: string,
  ) {
    return this.media.upload(file, userId);
  }

  @Get()
  @Roles(...CONTENT_ROLES)
  @ApiOperation({ summary: 'Список загруженных файлов' })
  findAll() {
    return this.media.findAll();
  }

  @Delete(':id')
  @Roles(...CONTENT_ROLES)
  @ApiOperation({ summary: 'Удалить файл (из MinIO и БД)' })
  remove(@Param('id') id: string) {
    return this.media.remove(id);
  }
}
