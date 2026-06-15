// app.config.js — reads tokens from .env, never hardcoded
module.exports = {
  expo: {
    name: 'DeliveryPartner',
    slug: 'delivery-partner',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.deliverypartner.app',
    },
    android: {
      package: 'com.deliverypartner.app',
      adaptiveIcon: {
        backgroundColor: '#FC8019',
        foregroundImage: './assets/adaptive-icon.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        '@rnmapbox/maps',
        {
          // Read from .env — never hardcoded
          RNMapboxMapsDownloadToken: process.env.MAPBOX_SECRET_TOKEN ?? '',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'ec1a287d-4b31-4724-8635-25446fb17cf7',
      },
    },
  },
};
