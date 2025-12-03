import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Studify</Text>
      <Text style={styles.greeting}>Selamat Datang, Admin!</Text>

      <View style={styles.grid}>
        <MenuCard title="Tambah Mahasiswa" />
        <MenuCard title="Tambah Dosen" />
        <MenuCard title="Tambah Kelas" />
      </View>
    </View>
  );
}

function MenuCard({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name="add-outline" size={32} color="#0B173B" />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
}

/* Style */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    paddingHorizontal: 22,
    paddingTop: 20,
  },

  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E8DF1",
    marginTop: 18,
  },

  greeting: {
    fontSize: 16,
    color: "#444",
    marginTop: 2,
    marginBottom: 22,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "46%",
    height: 110,
    backgroundColor: "#FFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  cardText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#0B173B",
    textAlign: "center",
  },
});
