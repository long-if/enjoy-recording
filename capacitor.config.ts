import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.longif.xiangji',
  appName: '享记',
  webDir: 'dist',
  "server": {
    // 使用本地前端资源
    // "url": "http://localhost:8000",
    "cleartext": true,               // 允许非加密流量
    androidScheme: "http",
  },
  "plugins": {
    "StatusBar": {
      "overlaysWebView": true,
      "style": "DEFALUT",
    }
  }
};

export default config;
