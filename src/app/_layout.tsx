/**
 * IMPORTS
 */

import "../../global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { BrandProvider, useTheme } from "@/shared/brand/BrandProvider";

import { QueryClient, QueryClientProvider } from "@/shared/libs/tanstack-query/tanstack-query";

const queryCliente = new QueryClient();

// O splash nativo fica até a splash animada (src/app/index.tsx) montar; a troca é com fade.
void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 400, fade: true });

function RootLayout() {
  const theme = useTheme();
  return (
    <QueryClientProvider client={queryCliente}>
      <BrandProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.primary,
            headerTitleStyle: { color: theme.text },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="index" options={{ animation: "fade" }} />
          <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
          <Stack.Screen name="sync" options={{ animation: "fade", gestureEnabled: false }} />
          <Stack.Screen name="signin" options={{ animation: "fade" }} />
          <Stack.Screen name="signin-up" />
          <Stack.Screen name="(private)" />
        </Stack>
      </BrandProvider>
    </QueryClientProvider>
  );
}

/**
 * EXPORTS
 */
export default RootLayout;
