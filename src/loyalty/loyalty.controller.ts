    import { Controller, Get, Param } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';

@Controller('loyalty')
export class LoyaltyController {
  constructor(private loyaltyService: LoyaltyService) {}

  @Get(':customerId')
  getLoyalty(@Param('customerId') customerId: string) {
    return this.loyaltyService.getLoyalty(customerId);
  }
}
