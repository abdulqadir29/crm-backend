import { Injectable } from '@nestjs/common';
import { TilbyService } from '../common/tilby.service';

@Injectable()
export class LoyaltyService {
  constructor(private tilby: TilbyService) {}

  async getLoyalty(customerId: string) {
    return this.tilby.getLoyalty(customerId);
  }
}
