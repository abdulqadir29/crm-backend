import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],   // ✅ TilbyService available
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
