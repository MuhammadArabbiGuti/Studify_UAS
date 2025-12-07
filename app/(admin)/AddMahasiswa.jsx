import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loadSiswa, saveSiswa } from "../../src/storage/siswaStorage";

export default function AddSiswa() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [siswaList, setSiswaList] = useState([]);

    useEffect(() => {
        loadSiswa().then(setSiswaList);
    }, []);

    const handleAddSiswa = async () => {
        if(!name || !email) return Alert.alert("Error", "Lengkapi data");

        const newItem = { id: Date.now(), name, email };

        const updated = await saveSiswa(newItem);

        setSiswaList(updated);
        
        Alert.alert("Sukses", "Siswa ditambahkan")

        setName("");
        setEmail("");
    };

    return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Ionicons name="add" size={30} color="#1a1a1a" />
                <Text style={styles.headerTitle}>Daftar dan tambah Mahasiswa</Text>
            </View>
            <Text style={styles.headerSubtitle}>Isi semua formulir dibawah ini!</Text>
          <TextInput style={styles.input} placeholder="Nama" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
    
                <TouchableOpacity onPress={handleAddSiswa} style={{ marginTop: 18 }}>
                    <LinearGradient
                        colors={["#3252F4", "#23B3FA"]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.submitBtn}
                    >
                        <Text style={styles.submitText}>Tambahkan</Text>
                    </LinearGradient>
                </TouchableOpacity>

          <Text style={{ marginTop: 20, fontWeight: "bold" }}>Daftar Mahasiswa</Text>
            <FlatList
                data={siswaList}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.headerSubtitle}>{item.name} - {item.email}</Text>
                )}
            />
        </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#F4F7FB",
      paddingHorizontal: 20,
      paddingTop: 25,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 18,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: "#1A1A1A",
    },
    headerSubtitle: {
      color: "#6F6F6F",
      fontSize: 13,
      marginTop: 2,
      marginBottom: 18,
    },
    input: {
      backgroundColor: "#F2F2F2",
      borderRadius: 10,
      padding: 14,
      marginTop: 10,
      fontSize: 14,
    },
    submitBtn: {
      borderRadius: 12,
      paddingVertical: 14,
    },
    submitText: {
      textAlign: "center",
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
  });