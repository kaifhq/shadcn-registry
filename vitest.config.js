import path from 'node:path'
export default {
  test: {
    globals: true,
    //environment: 'happy-dom',
    coverage: {
      enabled: true,
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
  resolve: {
    alias: {
      'kaif': path.resolve(__dirname, './src'),
    },
  },
}
