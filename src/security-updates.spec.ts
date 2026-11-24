import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Minimum patched versions for the advisories tracked in
 * GHSA-p498-v437-472g, GHSA-36xv-jgw5-4q75, GHSA-2g4f-4pwh-qvx6,
 * GHSA-w5vr-8v7q-w6rv, GHSA-5v7r-6r5c-r473, GHSA-j47w-4g3g-c36v,
 * GHSA-r4q5-vmmm-2653, GHSA-q8mj-m7cp-5q26, GHSA-6pq8-jhm2-2vcw and
 * GHSA-4mjr-xmp4-gh2g.
 */
const MINIMUM_VERSIONS: Record<string, string> = {
  '@humanfs/node': '0.16.8',
  '@nestjs/core': '11.1.18',
  ajv: '6.14.0',
  'baseline-browser-mapping': '2.11.0',
  'file-type': '21.3.1',
  'follow-redirects': '1.16.0',
  qs: '6.15.2',
};

function compareVersions(left: string, right: string): number {
  const parse = (version: string): number[] =>
    version
      .split('-')[0]
      .split('.')
      .map((part) => Number.parseInt(part, 10) || 0);
  const a = parse(left);
  const b = parse(right);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

describe('security dependency updates', () => {
  const lockfilePath = join(__dirname, '..', 'package-lock.json');
  const lockfile = JSON.parse(readFileSync(lockfilePath, 'utf8')) as {
    packages: Record<string, { version?: string }>;
  };

  it.each(Object.entries(MINIMUM_VERSIONS))(
    'resolves %s at or above the patched version %s',
    (name, minimum) => {
      const entries = Object.entries(lockfile.packages)
        .filter(
          ([key]) =>
            key === `node_modules/${name}` ||
            key.endsWith(`/node_modules/${name}`),
        )
        .map(([key, value]) => ({ key, version: value.version }));

      expect(entries.length).toBeGreaterThan(0);
      const outdated = entries.filter(
        ({ version }) =>
          version !== undefined && compareVersions(version, minimum) < 0,
      );

      expect(outdated).toEqual([]);
    },
  );
});
