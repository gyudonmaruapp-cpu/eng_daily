import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Archivo_400Regular, Archivo_600SemiBold, Archivo_800ExtraBold } from "@expo-google-fonts/archivo";
import { Kalam_700Bold } from "@expo-google-fonts/kalam";
import { View } from "react-native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { AppDataProvider } from "./src/context/AppDataContext";
import { color } from "./src/theme/tokens";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
    Kalam_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: color.bg }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <AppDataProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </AppDataProvider>
      </SafeAreaProvider>
    </View>
  );
}
