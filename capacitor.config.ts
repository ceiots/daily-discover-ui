import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'my-react-app',
  webDir: 'build',
  "icon": {
    "path": "public/background.jpg"
  }
};

export default config;
