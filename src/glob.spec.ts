import { readFileSync } from 'fs';
import { join } from 'path';

function isVulnerable(version: string): boolean {
  const [major, minor] = version.split('.').map(Number);
  if (major === 11) {
    return minor < 1;
  }
  if (major === 10) {
    return minor >= 2 && minor < 5;
  }
  return false;
}

describe('glob dependency', () => {
  const lockfilePath = join(__dirname, '..', 'package-lock.json');

  it('resolves no glob version affected by GHSA-5j98-mcp5-4vw2', () => {
    const lockfile = JSON.parse(readFileSync(lockfilePath, 'utf8'));
    const globEntries = Object.entries(lockfile.packages)
      .filter(
        ([key]) =>
          key === 'node_modules/glob' ||
          key.endsWith('/node_modules/glob'),
      )
      .map(([key, value]) => ({
        key,
        version: (value as { version: string }).version,
      }));

    expect(globEntries.length).toBeGreaterThan(0);
    expect(globEntries.filter(({ version }) => isVulnerable(version))).toEqual(
      [],
    );
  });
});
