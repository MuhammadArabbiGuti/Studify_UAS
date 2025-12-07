import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { loadClasses } from "../../../src/storage/classStorage";

export default function KelasAdmin() {
  const [kelasList, setKelasList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadClasses().then(setKelasList);
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      {kelasList.map(kelas => (
        <TouchableOpacity
          key={kelas.id}
          onPress={() => router.push(`/(admin)/(kelas)/${kelas.id}`)}
          style={{ padding: 18, backgroundColor: "#fff", marginBottom: 10, borderRadius: 12 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color:"#000" }}>{kelas.title}</Text>
          <Text style={{ color: "#777" }}>{Array.isArray(kelas.siswa) ? kelas.siswa.length : 0} mahasiswa</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
