import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfig from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  plugins: [tsConfig(), swc.vite()],
});
