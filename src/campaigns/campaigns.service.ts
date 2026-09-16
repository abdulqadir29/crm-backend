import { Injectable } from '@nestjs/common';
import { WhatsappService } from '../common/whatsapp.service';
import { JsonFileUtil } from '../common/json-file.util';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CampaignsService {
  constructor(private whatsapp: WhatsappService) {}

  async create(recipients: string[], template: string) {
    const id = uuid();
    const results: any = [];

    for (const to of recipients) {
      const res = await this.whatsapp.sendMessage(to, template);
      results.push({ to, res });
    }

    const logs = JsonFileUtil.read('logs.json');
    if (!logs.campaigns) logs.campaigns = [];
    logs.campaigns.push({
      id,
      template,
      recipients,
      date: new Date().toISOString(),
      results,
    });
    JsonFileUtil.write('logs.json', logs);

    return { id, status: 'completed' };
  }

  status(id: string) {
    const logs = JsonFileUtil.read('logs.json');
    return (
      logs.campaigns?.find((c: any) => c.id === id) || { status: 'not_found' }
    );
  }
}
