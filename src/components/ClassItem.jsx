import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../src/context/ThemeContext";

export default function ClassItem({ kelas }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#0D0D0D" : "#FFFFFF";
    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    return (
        <View style={[styles.card, {backgroundColor: card, borderColor: border, borderWidth: 1}]}>
            <Text style={[styles.title, {color: text}]}>{kelas.title}</Text>
            <View style={styles.row}>
                <Ionicons name="person" size={14} color={text} />
                <Text style={[styles.subtitle, {color: text}]}>{kelas.teacher}</Text>
            </View>
            <View style={styles.row}>
                <Ionicons name="time" size={14} color={text} />
                <Text style={[styles.subtitle, {color: text}]}>{kelas.hari} {kelas.jam}</Text>
            </View>

        <Text style={[styles.progressText, {color: text}]}>Pertemuan: {Math.round(kelas.session)} / {kelas.total} Sesi</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressBar, { width: `${kelas.session/kelas.total * 100}%` }]} />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      padding: 14,
      borderRadius: 14,
      marginTop: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 4
    },
    row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    title: { fontSize: 16, fontWeight: "600", color: "black" },
    subtitle: { fontSize: 13, marginLeft: 6, color: "#666" },
    progressBg: { height: 6, width: "100%", marginTop: 8, backgroundColor: "#e5ecf4", borderRadius: 4 },
    progressBar: { height: "100%", backgroundColor: "#2f89ff", borderRadius: 4 },
    progressText: { fontSize: 12, marginTop: 4, color: "#666" }
  });