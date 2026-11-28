import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface PackageJson {
  dependencies: Record<string, string>;
}

interface PackageLock {
  packages: Record<string, { version?: string }>;
}

function readJsonFile<T>(...segments: string[]): T {
  return JSON.parse(
    readFileSync(join(__dirname, '..', ...segments), 'utf8'),
  ) as T;
}

function isAtLeast(version: string, minimum: string): boolean {
  const parse = (value: string) =>
    value.split('.').map((part) => Number.parseInt(part, 10));
  const [major, minor, patch] = parse(version);
  const [minMajor, minMinor, minPatch] = parse(minimum);

  return (
    major > minMajor ||
    (major === minMajor && minor > minMinor) ||
    (major === minMajor && minor === minMinor && patch >= minPatch)
  );
}

/**
 * The running application pairs @nestjs/core with @nestjs/common, so both
 * must be declared and locked at the same supported release line.
 */
describe('NestJS platform dependencies', () => {
  const packageJson = readJsonFile<PackageJson>('package.json');
  const packageLock = readJsonFile<PackageLock>('package-lock.json');

  it('declares @nestjs/common at 12.6.3 or newer', () => {
    const range = packageJson.dependencies['@nestjs/common'];

    expect(range).toMatch(/^\^?12\.6\.3$/);
  });

  it('locks @nestjs/common and @nestjs/core at 12.6.3 or newer', () => {
    const common =
      packageLock.packages['node_modules/@nestjs/common']?.version ?? '0.0.0';
    const core =
      packageLock.packages['node_modules/@nestjs/core']?.version ?? '0.0.0';

    expect(isAtLeast(common, '12.6.3')).toBe(true);
    expect(isAtLeast(core, '12.6.3')).toBe(true);
  });
});
