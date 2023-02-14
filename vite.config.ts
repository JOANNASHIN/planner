import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export const ssrTransformCustomDir = () => {
  return {
    props: [],
    needRuntime: true,
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "/src/styles/global.scss";',
      },
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          directiveTransforms: {
            lazy: ssrTransformCustomDir,
          },
        },
      },
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
