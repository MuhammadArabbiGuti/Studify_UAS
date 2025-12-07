import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { classAPI } from "../../../src/services/api";

export default function KelasAdmin() {
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setRefreshing(true);
      const response = await classAPI.getAll();
      if (response.success) {
        setKelasList(response.data);
      } else {
        Alert.alert("Error", response.message || "Gagal memuat data kelas");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memuat data kelas: " + error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadClasses();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3252F4" />
        <Text style={styles.loadingText}>Memuat data kelas...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Kelas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/(admin)/AddClass")}
        >
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Tambah Kelas</Text>
        </TouchableOpacity>
      </View>

      {kelasList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>Belum ada kelas</Text>
          <Text style={styles.emptySubText}>Klik tombol "Tambah Kelas" untuk membuat kelas baru</Text>
        </View>
      ) : (
        kelasList.map(kelas => (
          <TouchableOpacity
            key={kelas.id}
            onPress={() => router.push(`/(admin)/(kelas)/${kelas.id}`)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="school" size={24} color="#3252F4" />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{kelas.class_name || kelas.title}</Text>
                <Text style={styles.cardCode}>{kelas.class_code || kelas.kode || "-"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.infoItem}>
                <Ionicons name="person" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {kelas.student_count || (Array.isArray(kelas.siswa) ? kelas.siswa.length : 0)} mahasiswa
                </Text>
              </View>
              {kelas.lecturer_names && (
                <View style={styles.infoItem}>
                  <Ionicons name="briefcase" size={16} color="#666" />
                  <Text style={styles.infoText} numberOfLines={1}>
                    {kelas.lecturer_names}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6FB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#3252F4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#BBB",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cardCode: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
});
