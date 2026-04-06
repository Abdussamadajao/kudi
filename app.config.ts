export default {
  expo: {
    name: "ini",
    slug: "ini",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "ini",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      softwareKeyboardLayoutMode: "resize",
      adaptiveIcon: {
        backgroundColor: "#10B981",
        backgroundImage: "./assets/images/android-icon-background.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.abdussamadajao.ini",
      buildType: "apk",
    },
    web: {
      output: "server",
      favicon: "./assets/images/favicon.png",
      bundler: "metro",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://ini.app/",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#10B981",
        },
      ],
      [
        "expo-dev-client",
        {
          launchMode: "most-recent",
        },
      ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
