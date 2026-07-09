import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { CrmModule } from '../crm/crm.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [CrmModule, MediaModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
