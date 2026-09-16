import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TilbyService } from './tilby.service';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [HttpModule], // provides HttpService
  providers: [TilbyService, WhatsappService],
  exports: [TilbyService, WhatsappService, HttpModule], // re-export for other modules
})
export class CommonModule {}
