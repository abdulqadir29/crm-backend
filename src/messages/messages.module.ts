import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],   // ✅ WhatsappService available
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
