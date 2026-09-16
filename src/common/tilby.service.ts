// import { HttpException, Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class TilbyService {
//   private readonly baseUrl = 'https://api.tilby.com/v2';
//   private readonly apiKey = process.env.TILBY_API_KEY;

//   constructor(private http: HttpService) {}

//   //   async getCustomers() {
//   //     const res = await firstValueFrom(
//   //       this.http.get(`${this.baseUrl}/customers`, {
//   //         headers: { Authorization: `Bearer ${this.apiKey}` },
//   //       }),
//   //     );
//   //     return res.data;
//   //   }
//   async getCustomers() {
//     try {
//       const res = await firstValueFrom(
//         this.http.get(`${this.baseUrl}/customers`, {
//           headers: { Authorization: `Bearer ${this.apiKey}` },
//         }),
//       );
//       return res.data;
//     } catch (err: any) {
//       const status = err.response?.status || 500;
//       const message =
//         err.response?.data?.error?.message ||
//         err.message ||
//         'Unknown Tilby API error';

//       // ✅ Throw a clean NestJS HttpException instead of raw error
//       throw new HttpException({ error: 'Tilby API error', message }, status);
//     }
//   }

//   async getCustomerById(id: string) {
//     const res = await firstValueFrom(
//       this.http.get(`${this.baseUrl}/customers/${id}`, {
//         headers: { Authorization: `Bearer ${this.apiKey}` },
//       }),
//     );
//     return res.data;
//   }

//   async getLoyalty(customerId: string) {
//     const res = await firstValueFrom(
//       this.http.get(`${this.baseUrl}/customers/${customerId}/loyalty`, {
//         headers: { Authorization: `Bearer ${this.apiKey}` },
//       }),
//     );
//     return res.data;
//   }
// }

import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TilbyService {
  private readonly baseUrl = 'https://api.tilby.com/v2';
  private readonly apiKey = process.env.TILBY_API_KEY;

  private get headers() {
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  async getCustomers() {
    try {
      const res = await axios.get(`${this.baseUrl}/customers`, {
        headers: this.headers,
      });
      return res.data;
    } catch (err: any) {
      const status = err.response?.status || 500;
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        'Unknown Tilby API error';
      throw new HttpException({ error: 'Tilby API error', message }, status);
    }
  }

  async getCustomerById(id: string) {
    try {
      const res = await axios.get(`${this.baseUrl}/customers/${id}`, {
        headers: this.headers,
      });
      return res.data;
    } catch (err: any) {
      const status = err.response?.status || 500;
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        'Unknown Tilby API error';
      throw new HttpException({ error: 'Tilby API error', message }, status);
    }
  }

  async getLoyalty(customerId: string) {
    try {
      const res = await axios.get(
        `${this.baseUrl}/customers/${customerId}/loyalty`,
        { headers: this.headers },
      );
      return res.data;
    } catch (err: any) {
      const status = err.response?.status || 500;
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        'Unknown Tilby API error';
      throw new HttpException({ error: 'Tilby API error', message }, status);
    }
  }
}
