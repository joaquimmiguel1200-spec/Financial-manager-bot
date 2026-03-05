import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d27214b5ded346b790ae9064a136f0b8',
  appName: 'FinançasIA',
  webDir: 'dist',
  server: {
    url: 'https://d27214b5-ded3-46b7-90ae-9064a136f0b8.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0d9668',
      showSpinner: false,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      backgroundColor: '#0d9668',
      style: 'LIGHT',
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0d9668',
  },
};

export default config;
