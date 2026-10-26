import { readFileSync } from 'fs';
import { join } from 'path';

describe('body-parser dependency', () => {
  const lockfilePath = join(__dirname, '..', 'package-lock.json');

  it('resolves a non-vulnerable body-parser (>= 2.4.0)', () => {
    const lockfile = JSON.parse(readFileSync(lockfilePath, 'utf8'));
    const entry = lockfile.packages['node_modules/body-parser'];
    expect(entry).toBeDefined();
    const version = entry.version as string;
    const [major, minor] = version.split('.').map(Number);
    expect(major).toBeGreaterThanOrEqual(2);
    if (major === 2) {
      expect(minor).toBeGreaterThanOrEqual(4);
    }
  });
});
