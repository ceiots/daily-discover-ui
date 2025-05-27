import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: '每日发现',
  webDir: 'build',
  "icon": {
    "path": "public/background.jpg"
  }
};

export default config;
