import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { loadTasks, saveTask } from '../../src/storage/taskStorage';

export default function AddTask() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [session, setSession] = useState("");
    const [deadline, setDeadline] = useState("");

    const [taskList, setTaskList] = useState([]);

    const { kelas } = useLocalSearchParams();

    useEffect(() => {
      loadTasks().then(setTaskList);
    }, []);

    const handleAddTask = async () => {
        if(!title || !desc || !session || !deadline) {
          return Alert.alert("Mohon lengkapi semua field");
        }
        
        const newTask = {
            id: Date.now().toString(),
            title,
            desc,
            kelas,
            dosen: "Saya",
            session: Number(session),
            deadline,
            submit: 0,
        };

        const updated = await saveTask(newTask);
        setTaskList(updated);

        Alert.alert("Tugas berhasil ditambahkan");

        setTitle("");
        setDesc("");
        setSession("");
        setDeadline("");
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Ionicons name="add" size={30} color="#1A1A1A" />
                    <Text style={styles.headerTitle}>Tambah Tugas</Text>
                </View>
                <Text style={styles.headerSubtitle}>Isi semua formulir dibawah ini!</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Judul tugas"
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Deskripsi"
                    value={desc}
                    onChangeText={setDesc}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Sesi"
                    value={String(session)}
                    onChangeText={(text) => setSession(Number(text))}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Deadline"
                    value={deadline}
                    onChangeText={setDeadline}
                />

                <TouchableOpacity onPress={() => handleAddTask()} style={{ marginTop: 18 }}>
                    <LinearGradient
                        colors={["#3252F4", "#23B3FA"]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.submitBtn}
                    >
                        <Text style={styles.submitText}>Tambahkan</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
    label: {
      fontSize: 13,
      color: "#1A1A1A",
      marginTop: 16,
      marginBottom: 4,
    },
    studentList: {
      backgroundColor: "#F2F2F2",
      borderRadius: 10,
      padding: 10,
    },
    studentItem: {
      fontSize: 13,
      color: "#1A1A1A",
      marginBottom: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 14,
    },
    inputSmall: {
      backgroundColor: "#F2F2F2",
      padding: 10,
      width: 65,
      borderRadius: 8,
      textAlign: "center",
    },
    dateBox: {
      backgroundColor: "#F2F2F2",
      padding: 10,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
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
  