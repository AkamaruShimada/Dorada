// backend/src/config/vitest.config.ts


import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true, // permet d'utiliser describe/it/expect sans les importer partout
  },
});