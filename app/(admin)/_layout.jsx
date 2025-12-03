import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          title: "Admin",
          headerRight: () => (
            <Pressable
              onPress={() => router.replace("/role")}     
              style={{ marginRight: 15 }}
            >
              <Text style={{ fontSize: 16, color: "#007AFF", fontWeight: "600" }}>
                Logout
              </Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
