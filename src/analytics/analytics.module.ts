import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TilbyService } from '../common/tilby.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule], // ✅ brings WhatsappService + HttpService
  controllers: [AnalyticsController],
  providers: [AnalyticsService, TilbyService],
})
export class AnalyticsModule {}
