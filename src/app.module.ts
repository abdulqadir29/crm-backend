import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { MessagesModule } from './messages/messages.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from './logs/logs.module';
import { TilbyService } from './common/tilby.service';
import { WhatsappService } from './common/whatsapp.service';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from './common/common.module';
import { ConfigsModule } from './config/config.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅
    HttpModule.register({ timeout: 5000 }),
    CustomersModule,
    LoyaltyModule,
    MessagesModule,
    CampaignsModule,
    AnalyticsModule,
    ConfigsModule,
    LogsModule,
    CommonModule,
    HealthModule,
  ],
  // providers: [TilbyService, WhatsappService],
  // exports: [TilbyService, WhatsappService],
})
export class AppModule {}
