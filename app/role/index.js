import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RoleSelect() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk sebagai</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/(mahasiswa)")}>
        <Text style={styles.buttonText}>Mahasiswa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/(dosen)")}>
        <Text style={styles.buttonText}>Dosen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/(admin)")}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 22, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 15 },
  button: {
    backgroundColor: "#111",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: { fontSize: 18, fontWeight: "600", color: "#fff" },
});
