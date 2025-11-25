import 'dotenv/config';

export default {
  expo: {
    name: 'expo-go-villa-sample',
    slug: 'expo-go-villa-sample',
    version: '1.0.0',
    scheme: 'expo-go-villa-sample',
    platforms: ['ios', 'android'],
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
          microphonePermission:
            'Allow $(PRODUCT_NAME) to access your microphone',
          recordAudioAndroid: true,
        },
      ],
      'expo-localization',
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    // NOTE: Avoid embedding sensitive secrets in `expo.extra`.
    // Provide sensitive values via CI/build-time env vars and do not commit them to the repo.
    extra: {
      API_URL: process.env.API_URL,
      // SECRET_KEY intentionally omitted from extra to avoid shipping secrets in app bundles.
      VAR_NUMBER: process.env.VAR_NUMBER,
      VAR_BOOL: process.env.VAR_BOOL,
    },
  },
};
