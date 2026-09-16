import { Controller, Get, Param, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  getAll(@Query('filter') filter?: string) {
    return this.customersService.getAll(filter);
  }

  @Get('recent')
  async getRecentCustomers() {
    return await this.customersService.getCustomersAddedThisMonth();
  }

  @Get('stats')
  async getStats() {
    return await this.customersService.getStats();
  }

  // ✅ 1. Customers Growth Over Time
  @Get('growth')
  async getCustomerGrowth() {
    console.log('object');
    return await this.customersService.getCustomerGrowth();
  }

  // ✅ 2. Active vs Inactive
  @Get('active-stats')
  async getActiveStats() {
    return await this.customersService.getActiveStats();
  }

  // ✅ 3. Revenue Trend
  @Get('revenue-trend')
  async getRevenueTrend() {
    return await this.customersService.getRevenueTrend();
  }

  // ✅ 4. Top Customers
  @Get('top')
  async getTopCustomers() {
    return await this.customersService.getTopCustomers();
  }

  // ✅ 5. ARPU
  @Get('arpu')
  async getARPU() {
    return await this.customersService.getARPU();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    console.log('hit');
    return this.customersService.getOne(id);
  }
}
