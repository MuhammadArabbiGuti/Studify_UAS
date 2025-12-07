import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../src/context/ThemeContext";
import { useRole } from "../context/RoleContext";

export default function ClassItem({ kelas }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#0D0D0D" : "#FFFFFF";
    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    const router = useRouter();

    const { role } = useRole();

    return (
        <View style={[styles.card, {backgroundColor: card, borderColor: border, borderWidth: 1}]}>
          <View style={styles.info}>
            <View style={{flexDirection: "column"}}>
              <Text style={[styles.title, {color: text}]}>{kelas.title}</Text>
              <View style={styles.row}>
                <Ionicons name="person" size={14} color={text} />
                <Text style={[styles.subtitle, {color: text}]}>{kelas.dosen}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="time" size={14} color={text} />
                <Text style={[styles.subtitle, {color: text}]}>{kelas.day} {kelas.time}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push(`(${role})/(kelas)/${kelas.id}`)}>
              <LinearGradient
                colors={["#3252F4", "#23B3FA"]} 
                style={styles.iconBox}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              >
                <Ionicons name="information-circle" size={28} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={[styles.progressText, {color: text}]}>Pertemuan: {Math.round(kelas.current)} / {kelas.session} Sesi</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressBar, { width: `${kelas.current/kelas.session * 100}%` }]} />
          </View>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    card: {
      flexDirection: "column",
      backgroundColor: "#fff",
      padding: 14,
      borderRadius: 14,
      marginTop: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 4
    },
    iconBox: {
      backgroundColor: "#1e8df1",
      width: 50,
      height: 50,
      borderRadius: 18,      
      justifyContent: "center",
      alignItems: "center",
    },
    info: { flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
    row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    kolom : { flexDirection: "column"},
    title: { fontSize: 16, fontWeight: "600", color: "black" },
    subtitle: { fontSize: 13, marginLeft: 6, color: "#666" },
    progressBg: { height: 6, width: "100%", marginTop: 8, backgroundColor: "#e5ecf4", borderRadius: 4 },
    progressBar: { height: "100%", backgroundColor: "#2f89ff", borderRadius: 4 },
    progressText: { fontSize: 12, marginTop: 4, color: "#666" }
  });