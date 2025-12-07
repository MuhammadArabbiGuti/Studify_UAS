import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { loadClasses, saveClass } from "../../../src/storage/classStorage";

export default function DetailKelasAdmin() {
  const { id } = useLocalSearchParams();
  const [kelas, setKelas] = useState(null);

  useEffect(() => {
    loadClasses().then(data => {
      const find = data.find(item => item.id == id);
      if(!find) {
        Alert.alert('Error', 'Kelas tidak ditemukan'); 
        router.back();
      } else {
        setKelas(find);
      }
    });
  }, [id]);

  const handleHapus = async (mhsNama) => {
    Alert.alert("Konfirmasi", "Yakin ingin menghapus mahasiswa ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          const list = await loadClasses();
          
          const updated = list.map(c => {
            if (String(c.id) === String(id)) {
              return {
                ...c,
                siswa: Array.isArray(c.siswa)
                  ? c.siswa.filter(m => m !== mhsNama) 
                  : []
              };
            }
            return c;
          });
  
          await saveClass(updated);
          setKelas(updated.find(c => String(c.id) === String(id)));
        }
      }
    ]);
  };

  if (!kelas) return <Text>Memuat...</Text>;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "900", marginBottom: 16 }}>
        {kelas.name}
      </Text>

      {kelas.siswa.length === 0 && (
        <Text style={{ color: "#666" }}>Belum ada mahasiswa terdaftar.</Text>
      )}

      {kelas.siswa.map((nama, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>{nama}</Text>
          <TouchableOpacity onPress={() => handleHapus(index)}>
            <Text style={{ color: "red", fontWeight: "700" }}>Hapus</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
