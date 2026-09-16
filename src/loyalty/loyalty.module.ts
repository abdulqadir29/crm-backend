import { Module } from '@nestjs/common';
import { LoyaltyController } from './loyalty.controller';
import { LoyaltyService } from './loyalty.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],   // ✅ brings TilbyService + HttpService
  controllers: [LoyaltyController],
  providers: [LoyaltyService],
})
export class LoyaltyModule {}
