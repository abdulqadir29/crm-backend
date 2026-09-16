import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('customers')
  getMetrics() {
    return this.analyticsService.getCustomerMetrics();
  }

  @Get('exports')
  export(@Query('format') format: string) {
    return this.analyticsService.exportData(format);
  }
}
