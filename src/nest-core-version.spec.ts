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

/**
 * Guards the NestJS runtime major. The application bootstrap in src/main.ts
 * imports NestFactory from @nestjs/core, so the declared and locked versions
 * of that package must stay on the same supported major.
 */
describe('@nestjs/core dependency', () => {
  it('declares and locks the Nest 12 runtime', () => {
    const packageJson = readJsonFile<PackageJson>('package.json');
    const packageLock = readJsonFile<PackageLock>('package-lock.json');

    const declaredRange = packageJson.dependencies['@nestjs/core'];
    const lockedVersion =
      packageLock.packages['node_modules/@nestjs/core']?.version;

    expect(declaredRange).toMatch(/^\^?12\.\d+\.\d+$/);
    expect(lockedVersion).toMatch(/^12\.\d+\.\d+$/);
  });
});
