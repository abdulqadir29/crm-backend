import { Injectable } from '@nestjs/common';
import { TilbyService } from '../common/tilby.service';
import { JsonFileUtil } from '../common/json-file.util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AnalyticsService {
  constructor(private tilby: TilbyService) {}

async getCustomerMetrics() {
  const customers = await this.tilby.getCustomers();

  // Extract the array from results or default to empty array
  const customersArray = Array.isArray(customers)
    ? customers
    : customers?.results || [];

  return {
    total: customersArray.length,
    withLoyalty: customersArray.filter((c: any) => c.loyaltyPoints > 0).length,
  };
}


  async exportData(format: string) {
    const data = await this.tilby.getCustomers();
    const filePath = path.join(__dirname, `../../data/export.${format}`);
    if (format === 'csv') {
      const csv = data.map((c: any) => `${c.id},${c.name},${c.email}`).join('\n');
      fs.writeFileSync(filePath, csv);
    } else {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
    return { filePath };
  }
}
