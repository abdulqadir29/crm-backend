// import { Injectable } from '@nestjs/common';
// import { TilbyService } from '../common/tilby.service';

// @Injectable()
// export class CustomersService {
//   constructor(private tilby: TilbyService) {}

//   async getAll(filter?: string) {
//     const customers = await this.tilby.getCustomers();
//     if (filter) {
//       return customers.filter((c: any) =>
//         JSON.stringify(c).toLowerCase().includes(filter.toLowerCase()),
//       );
//     }
//     return customers;
//   }

//   async getOne(id: string) {
//     return this.tilby.getCustomerById(id);
//   }

//   async getCustomersAddedThisMonth() {
//     const allCustomers = await this.getAll();

//     const customersArray = Array.isArray(allCustomers)
//       ? allCustomers
//       : allCustomers?.results || [];

//     const startOfMonth = new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       1,
//     );

//     return customersArray
//       .filter((c) => new Date(c.created_at) >= startOfMonth)
//       .sort(
//         (a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
//       )
//       .slice(0, 5);
//   }

//   async getStats() {
//     const data = await this.getAll();
//     const customersArray = Array.isArray(data) ? data : data?.results || [];
//     const totalCustomers = customersArray.length;

//     // Define "active" as those with sales_count > 0 (adjust as needed)
//     const activeCustomers = customersArray.filter(
//       (c: any) => Number(c.sales_count) > 0,
//     ).length;

//     // Sum revenue from `tot_spent` if present
//     const totalRevenue = customersArray.reduce((sum: number, c: any) => {
//       const spent = Number(c.tot_spent);
//       return !isNaN(spent) ? sum + spent : sum;
//     }, 0);

//     return {
//       totalCustomers,
//       activeCustomers,
//       totalRevenue,
//     };
//   }
// }

import { Injectable } from '@nestjs/common';
import { TilbyService } from '../common/tilby.service';

@Injectable()
export class CustomersService {
  constructor(private tilby: TilbyService) {}

  async getAll(filter?: string) {
    const customers = await this.tilby.getCustomers();
    if (filter) {
      return customers.filter((c: any) =>
        JSON.stringify(c).toLowerCase().includes(filter.toLowerCase()),
      );
    }
    return customers;
  }

  async getOne(id: string) {
    return this.tilby.getCustomerById(id);
  }

  async getCustomersAddedThisMonth() {
    const allCustomers = await this.getAll();

    const customersArray = Array.isArray(allCustomers)
      ? allCustomers
      : allCustomers?.results || [];

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    return customersArray
      .filter((c) => new Date(c.created_at) >= startOfMonth)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }

  async getStats() {
    const data = await this.getAll();
    const customersArray = Array.isArray(data) ? data : data?.results || [];
    const totalCustomers = customersArray.length;

    const activeCustomers = customersArray.filter(
      (c: any) => Number(c.sales_count) > 0,
    ).length;

    const totalRevenue = customersArray.reduce((sum: number, c: any) => {
      const spent = Number(c.tot_spent);
      return !isNaN(spent) ? sum + spent : sum;
    }, 0);

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
    };
  }

  // ✅ 1. Customers Growth Over Time
  async getCustomerGrowth() {
    const data = await this.getAll();
    const customersArray = Array.isArray(data) ? data : data?.results || [];

    const grouped = customersArray.reduce((acc, c: any) => {
      const date = new Date(c.created_at);
      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, '0')}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, count]) => ({
      month,
      count,
    }));
  }

  // ✅ 2. Active vs Inactive
  async getActiveStats() {
    const data = await this.getAll();
    const customersArray = Array.isArray(data) ? data : data?.results || [];

    const active = customersArray.filter(
      (c: any) => Number(c.sales_count) > 0,
    ).length;

    const inactive = customersArray.length - active;

    return { active, inactive };
  }

  // ✅ 3. Revenue Trend
  async getRevenueTrend() {
    const data = await this.getAll();
    const customersArray = Array.isArray(data) ? data : data?.results || [];

    const grouped = customersArray.reduce((acc, c: any) => {
      const date = new Date(c.created_at);
      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, '0')}`;
        const spent = Number(c.tot_spent);
        acc[key] = (acc[key] || 0) + (isNaN(spent) ? 0 : spent);
      }
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }

  // ✅ 4. Top Customers
  async getTopCustomers() {
    const data = await this.getAll();
    const customersArray = Array.isArray(data) ? data : data?.results || [];

    return customersArray
      .map((c: any) => ({
        id: c.id,
        name: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
        tot_spent: Number(c.tot_spent) || 0,
      }))
      .sort((a, b) => b.tot_spent - a.tot_spent)
      .slice(0, 5);
  }

  // ✅ 5. Average Revenue Per User (ARPU)
  async getARPU() {
    const data = await this.getAll();
    const customersArray = Array.isArray(data) ? data : data?.results || [];

    const totalRevenue = customersArray.reduce((sum: number, c: any) => {
      const spent = Number(c.tot_spent);
      return !isNaN(spent) ? sum + spent : sum;
    }, 0);

    const totalCustomers = customersArray.length;
    const arpu = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    return {
      arpu,
      totalRevenue,
      totalCustomers,
    };
  }
}
