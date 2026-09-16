import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  create(@Body() body: { recipients: string[]; template: string }) {
    return this.campaignsService.create(body.recipients, body.template);
  }

  @Get(':id/status')
  status(@Param('id') id: string) {
    return this.campaignsService.status(id);
  }
}
