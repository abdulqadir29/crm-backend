import * as fs from 'fs';
import * as path from 'path';

export class JsonFileUtil {
  private static basePath = path.join(__dirname, '../../data');

  static read(file: string) {
    const fullPath = path.join(this.basePath, file);
    if (!fs.existsSync(fullPath)) return {};
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  }

  static write(file: string, data: any) {
    const fullPath = path.join(this.basePath, file);
    fs.mkdirSync(this.basePath, { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  }
}
