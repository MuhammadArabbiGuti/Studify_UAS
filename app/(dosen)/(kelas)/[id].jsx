import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AnnouncementItem from "../../../src/components/AnnouncementItem";
import MaterialItem from "../../../src/components/MaterialItem";
import TaskItem from "../../../src/components/TaskItem";
import { useRole } from "../../../src/context/RoleContext";
import { useTheme } from "../../../src/context/ThemeContext";
import { loadAnnouncements } from "../../../src/storage/announcementStorage";
import { loadClasses } from "../../../src/storage/classStorage";
import { loadMaterials } from "../../../src/storage/materialStorage";
import { loadTasks } from "../../../src/storage/taskStorage";

export default function ClassDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [kelas, setKelas] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [materi, setMateri] = useState(null);
    const [ann, setAnn] = useState(null);

    const filteredTask = Array.isArray(tasks) && kelas?.title
        ? tasks.filter(t => t.kelas?.toLowerCase() === kelas.title.toLowerCase()) 
        : [];

    const filteredMateri = Array.isArray(materi) && kelas?.title
        ? materi.filter(m => m.kelas?.toLowerCase() === kelas.title.toLowerCase()) 
        : [];

    const filteredAnn = Array.isArray(ann) && kelas?.title
        ? ann.filter(a => a.kelas?.toLowerCase() === kelas.title.toLowerCase()) 
        : [];

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#0D0D0D" : "#FFFFFF";
    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    const { role } = useRole();

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

  useEffect(() => {
    (async () => {
        try {
            const data = await loadTasks();
            setTasks(data);
        } catch (e) {
            console.error("Error loadTasks:", e);
        }
    })();
  }, []);

  useEffect(() => {
    (async () => {
        try {
            const data = await loadMaterials();
            setMateri(data);
        } catch (e) {
            console.error("Error loadMaterials:", e);
        }
    })();
  }, []);

  useEffect(() => {
    (async () => {
        try {
            const data = await loadAnnouncements();
            setAnn(data);
        } catch (e) {
            console.error("Error loadAnnouncements:", e);
        }
    })();
  }, []);

  if (!kelas) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center",color: text }}>
        <Text>Memuat data kelas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.screen, {backgroundColor: bg}]} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={[styles.title, {color: text}]}>{kelas.title}</Text>
        <Text style={[styles.subtitle, {color: text}]}>{kelas.day}, {kelas.time}</Text>

        <Text style={[styles.sessionText, {color: text}]}>Pertemuan: {kelas.current} / {kelas.session} sesi </Text>

        <View style={styles.progressBg}>
            <View style={[styles.progressBar, { width: `${kelas.current/kelas.session * 100}%` }]} />
        </View>

        <View>
            <Text style={[styles.title, {color: text}]}>Tugas</Text>
            {filteredTask.length > 0 ? (
                filteredTask.map(item => (
                    <TaskItem key={item.id} task={item} />
                ))
            ) : (
                <Text style={[styles.subtitle, {color: text}]}>
                    Belum ada tugas untuk kelas ini
                </Text>
            )}
        </View>

        <View>
            <Text style={[styles.title, {color: text}]}>Materi</Text>
            {filteredMateri.length > 0 ? (
                filteredMateri.map(item => (
                    <MaterialItem key={item.id} material={item} />
                ))
            ) : (
                <Text style={[styles.subtitle, {color: text}]}>
                    Belum ada materi untuk kelas ini
                </Text>
            )}
        </View>

        <View>
            <Text style={[styles.title, {color: text}]}>Pemberitahuan</Text>
            {filteredAnn.length > 0 ? (
                filteredAnn.map(item => (
                    <AnnouncementItem key={item.id} announcement={item} />
                ))
            ) : (
                <Text style={[styles.subtitle, {color: text}]}>
                    Belum ada pemberitahuan untuk kelas ini
                </Text>
            )}
        </View>

        <TouchableOpacity onPress={() => router.push({pathname: "/(dosen)/AddTask", params: { kelas: kelas.title }})} style={{ marginTop: 18 }}>
          <LinearGradient
            colors={["#3252F4", "#23B3FA"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>Tambahkan Tugas</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push({pathname: "/(dosen)/AddMateri", params: { kelas: kelas.title }})} style={{ marginTop: 18 }}>
          <LinearGradient
            colors={["#3252F4", "#23B3FA"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>Tambahkan Materi</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push({pathname: "/(dosen)/AddAnnounce", params: { kelas: kelas.title }})} style={{ marginTop: 18 }}>
          <LinearGradient
            colors={["#3252F4", "#23B3FA"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>Tambahkan Pemberitahuan</Text>
          </LinearGradient>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#F4F7FB",
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    title: { fontSize: 20, fontWeight: "800", marginBottom: 4, marginTop: 7 },
    subtitle: { fontSize: 14, color: "#5A5A5A" },
    sessionText: { marginTop: 10, fontSize: 13, fontWeight: "500" },
    progressBg: { height: 6, width: "100%", marginTop: 8, backgroundColor: "#e5ecf4", borderRadius: 4 },
    progressBar: { height: "100%", backgroundColor: "#2f89ff", borderRadius: 4 },
    card: {
      backgroundColor: "#fff",
      padding: 18,
      borderRadius: 16,
      marginTop: 14,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    cardTitle: { fontSize: 15, fontWeight: "700", marginBottom: 6 },
    cardDesc: { fontSize: 13, color: "#5A5A5A", marginBottom: 14 },
    rowBetween: { flexDirection: "row", justifyContent: "space-between" },
    pertemuanSmall: { fontSize: 12, color: "#747474" },
    dateSmall: { fontSize: 12, color: "#747474" },
    iconBtn: {
      width: 55,
      height: 55,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
    },
    commentInput: {
      backgroundColor: "#ECEDEF",
      padding: 12,
      borderRadius: 10,
      marginTop: 14,
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
  
