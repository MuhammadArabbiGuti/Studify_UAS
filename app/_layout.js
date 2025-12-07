import { Stack } from "expo-router";
import { RoleProvider } from "../src/context/RoleContext";

export default function RootLayout() {
  return (
    <RoleProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="role/index" />
      <Stack.Screen name="(mahasiswa)" options={{ headerShown: false }} />
      <Stack.Screen name="(dosen)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
    </Stack>
    </RoleProvider>
  );
}
