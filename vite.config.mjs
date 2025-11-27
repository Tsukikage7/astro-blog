import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['clsx', 'tailwind-merge'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'plyr',
      'fuse.js',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['astro'],
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
