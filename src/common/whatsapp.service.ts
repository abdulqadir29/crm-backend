import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
  private readonly baseUrl = 'https://graph.facebook.com/v17.0';
  private readonly token = process.env.WHATSAPP_TOKEN;
  private readonly phoneId = process.env.WHATSAPP_PHONE_ID;

  constructor(private http: HttpService) {}

  async sendMessage(to: string, template: string) {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template,
        language: { code: 'en_US' },
      },
    };

    const res = await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/${this.phoneId}/messages`,
        payload,
        { headers: { Authorization: `Bearer ${this.token}` } },
      ),
    );

    return res.data;
  }
}
