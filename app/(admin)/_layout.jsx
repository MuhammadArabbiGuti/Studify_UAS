import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function AdminLayout() {
  const router = useRouter();
  
  const handleLogout = () => {
    router.replace("/role");
  };

  return (
    <Tabs 
        screenOptions={{
          headerTitleAlign: "center",

          headerRight: () => (
            <Pressable onPress={handleLogout} style={{ marginRight: 15 }}>
              <Text style={{ fontSize: 16, color: "#1A1A1A", fontWeight: "600" }}>
                Logout
              </Text>
            </Pressable>
          ),
  
          headerLeft: () => (
            <Pressable onPress={() => router.push('/')} style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 16, color: "#1A1A1A", fontWeight: "600" }}>
                Kembali
              </Text>
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen name="index" options={{href: null, headerShown: true, headerTitle: "" }} />
        <Tabs.Screen name="AddClass" options={{href: null, headerShown: true, headerTitle: "" }} />
        <Tabs.Screen name="AddDosen" options={{href: null, headerShown: true, headerTitle: "" }} />
        <Tabs.Screen name="AddMahasiswa" options={{href: null, headerShown: true, headerTitle: "" }} />
    </Tabs>
  );
}
