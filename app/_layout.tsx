import Provider from "@/provider";
import { ThemeProvider } from "@/provider/theme-provider";
import { useAuthStore } from "@/stores";
import { useFonts } from "expo-font";
import { router, useRootNavigationState, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { isAuthenticated, isHydrated, hydrate } = useAuthStore();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const [fontsLoaded, fontError] = useFonts({
    "Manrope-ExtraLight": require("../assets/fonts/Manrope-ExtraLight.ttf"),
    "Manrope-Light": require("../assets/fonts/Manrope-Light.ttf"),
    "Manrope-Regular": require("../assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Medium": require("../assets/fonts/Manrope-Medium.ttf"),
    "Manrope-SemiBold": require("../assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-Bold": require("../assets/fonts/Manrope-Bold.ttf"),
    "Manrope-ExtraBold": require("../assets/fonts/Manrope-ExtraBold.ttf"),
  });

  const appReady = (fontsLoaded || !!fontError) && isHydrated;

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    if (!appReady || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [appReady, isAuthenticated, rootNavigationState?.key, segments]);

  if (fontError) throw fontError;

  // ← keep splash visible until ready, render nothing in the meantime
  if (!appReady) return null;

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <Provider />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
