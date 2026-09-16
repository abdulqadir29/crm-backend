import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  getConfig() {
    return this.configService.get();
  }

  @Post()
  saveConfig(@Body() body: any) {
    return this.configService.save(body);
  }
}
