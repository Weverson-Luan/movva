/**
 * IMPORTS
 */

import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { BrandProvider, useTheme } from "@/shared/brand/BrandProvider";

import { QueryClient, QueryClientProvider } from "@/shared/libs/tanstack-query/tanstack-query";

const queryCliente = new QueryClient();

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
          <Stack.Screen name="signin" />
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
