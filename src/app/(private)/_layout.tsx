/**
 * IMPORTS
 */
import { Stack } from "expo-router";

// Provedores, CSS e StatusBar já vêm do layout raiz (src/app/_layout.tsx).
// Aqui fica só a navegação das telas que exigem login.
const PrivateLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
    </Stack>
  );
};

/**
 * EXPORTS
 */
export default PrivateLayout;
