import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  controllers: [MediaController],
  providers: [S3Service, MediaService],
  exports: [S3Service, MediaService],
})
export class MediaModule {}
