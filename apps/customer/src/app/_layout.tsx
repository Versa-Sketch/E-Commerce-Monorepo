import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "../features/Auth/Providers/AuthProvider";
import { ProfileProvider } from "../features/Profile/Providers/ProfileProvider";
import { CartProvider } from "../features/Cart/Providers/CartProvider";
import { OrderProvider } from "../features/Orders/Providers/OrderProvider";
import { AddressProvider } from "../features/Addresses/Providers/AddressProvider";
import { StoresProvider } from "../features/Stores/Providers/StoresProvider";
import { BargainingProvider } from "../features/Bargaining/Providers/BargainingProvider";
import { ToastProvider } from "../Common/components/ui/Toast/ToastProvider";
import { hydrateStorage } from "../services/storage";
import { locationStore } from "../stores/LocationStore";
SplashScreen.preventAutoHideAsync().catch(() => {});
function RootNavigation() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="landing" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="customer" />
        <Stack.Screen name="store" />
        <Stack.Screen name="delivery" />
        <Stack.Screen name="admin" />
      </Stack>
    </>
  );
}
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Thin": require("../../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("../../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("../../assets/fonts/Poppins-Black.ttf"),
    "Inter-Thin": require("../../assets/fonts/Inter-Thin.ttf"),
    "Inter-ExtraLight": require("../../assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-Light": require("../../assets/fonts/Inter-Light.ttf"),
    "Inter-Regular": require("../../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../../assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-Black": require("../../assets/fonts/Inter-Black.ttf"),
    "Manrope-ExtraLight": require("../../assets/fonts/Manrope-ExtraLight.ttf"),
    "Manrope-Light": require("../../assets/fonts/Manrope-Light.ttf"),
    "Manrope-Regular": require("../../assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Medium": require("../../assets/fonts/Manrope-Medium.ttf"),
    "Manrope-SemiBold": require("../../assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-Bold": require("../../assets/fonts/Manrope-Bold.ttf"),
    "Manrope-ExtraBold": require("../../assets/fonts/Manrope-ExtraBold.ttf"),
    "Pacifico-Regular": require("../../assets/fonts/Pacifico-Regular.ttf"),
  });
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    hydrateStorage().finally(() => {
      setStorageReady(true);
      locationStore.hydrate();
      locationStore.refreshLocation();
    });
  }, []);
  useEffect(() => {
    if ((fontsLoaded || fontError) && storageReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, storageReady]);
  if ((!fontsLoaded && !fontError) || !storageReady) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            {}
            <ToastProvider>
              <AuthProvider>
                {}
                <ProfileProvider>
                  {}
                  <CartProvider>
                    {}
                    <OrderProvider>
                      {}
                      <AddressProvider>
                        {}
                        <StoresProvider>
                          {}
                          <BargainingProvider>
                            <RootNavigation />
                          </BargainingProvider>
                        </StoresProvider>
                      </AddressProvider>
                    </OrderProvider>
                  </CartProvider>
                </ProfileProvider>
              </AuthProvider>
            </ToastProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
