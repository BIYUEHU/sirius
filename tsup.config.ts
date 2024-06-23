import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig(() => {
  const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

  return {
    entryPoints: ['./src/Sirius.ts'],
    // minify: true,
    outDir: resolve(__dirname, 'server/plugins/Sirius/'),
    banner: {
      js: `
/**
 * @Package ${pkg?.name ?? 'unknown'}
 * @Version ${pkg?.version ?? 'unknown'}
 * @Author ${Array.isArray(pkg?.author) ? pkg.author.join(', ') : pkg?.author ?? ''}
 * @Copyright 2024 Arimura Sena. All rights reserved.
 * @License ${pkg?.license ?? 'GPL-3.0'}
 * @Link https://github.com/biyuehu/sirius
 * @Date ${new Date().toLocaleString()}
 */
`
    }
  };
});
