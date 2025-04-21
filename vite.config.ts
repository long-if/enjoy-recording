import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import ViteAutoImport from "unplugin-auto-import/vite";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteAutoImport({
      imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
      dts: './auto-imports.d.ts',
    }),
    AutoImport({
      resolvers: [ElementPlusResolver(), NaiveUiResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), NaiveUiResolver()],
    }),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: "electron/main.ts",
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer:
        process.env.NODE_ENV === "test"
          ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
          undefined
          : {},
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    }
  },
});
