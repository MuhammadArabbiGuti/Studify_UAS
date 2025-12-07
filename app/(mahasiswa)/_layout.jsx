import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext';

function TabsNavigation() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const bg = isDark ? "#0D0D0D" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#1A1A1A";

  const handleLogout = () => {
    router.replace("/role");
  };

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: bg },
        headerTitleStyle: { color: text },
        tabBarStyle: { backgroundColor: bg },
        tabBarActiveTintColor: isDark ? "#4F9CFF" : "#1E90FF",
        tabBarInactiveTintColor: isDark ? "#777" : "#999",

        headerRight: () => (
          <Pressable onPress={handleLogout} style={{ marginRight: 15 }}>
            <Text style={{ fontSize: 16, color: text, fontWeight: "600" }}>
              Logout
            </Text>
          </Pressable>
        ),

        headerLeft: () => (
          <Pressable onPress={() => router.push('/')} style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 16, color: text, fontWeight: "600" }}>
              Kembali
            </Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="kelas" options={{ title: "Kelas" }} />
      <Tabs.Screen name="notif" options={{ title: "Notifikasi" }} />
      <Tabs.Screen name="profil" options={{ title: "Profil" }} />
      <Tabs.Screen name="(kelas)/[id]" options={{ href: null }} />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <TabsNavigation />
    </ThemeProvider>
  );
}
