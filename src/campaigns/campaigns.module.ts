import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],   // ✅ brings WhatsappService + HttpService
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
