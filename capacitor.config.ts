import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.woxsen.app',
  appName: 'Woxsen App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;