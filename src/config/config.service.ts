import { Injectable } from '@nestjs/common';
import { JsonFileUtil } from '../common/json-file.util';

@Injectable()
export class ConfigService {
  private file = 'config.json';

  get() {
    return JsonFileUtil.read(this.file);
  }

  save(data: any) {
    JsonFileUtil.write(this.file, data);
    return { success: true };
  }
}
