import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from "../../src/context/ThemeContext";
import { dummyClasses } from "../data/dummyClasses";

function deadlineInfo(deadline) {
    if(!deadline) return { status: 'none', text: '' };

    const todayStr = new Date().toISOString().slice(0, 10);

    const t = new Date(`${todayStr}T00:00:00`);
    const d = new Date(`${deadline}T00:00:00`);

    if (isNaN(d.getTime())) {
        return { status: 'none', text: '' }
    }

    const diffMs = d - t;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (days < 0) return { status: 'overdue', text: 'Overdue'}
    if (days === 0) return { status: 'today', text: `Batas Waktu: Hari ini - ${deadline}` };
    return { status: 'future', text: `Batas Waktu: ${deadline}`}
}

export default function TaskItem({ task }) {

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    const info = deadlineInfo(task.deadline);

    const siswaKelas = dummyClasses.find(s => s.title === task.kelas)?.siswa ?? 0;

    return (
        <View style={[styles.card, {backgroundColor: card, borderColor: border, borderWidth: 1}]}>
            <View style={styles.info}>
                <Text style={[styles.title, {color: text}]}>{task.title}</Text>
                <Text style={[styles.subtitle, {color: text}]}>{task.kelas}</Text>
                
                {!!task.deadline && (
                    <Text style={[styles.subtitle, info.status === 'future' ?
                        {color: text} : {color:'red'}]}>
                            {info.text}
                    </Text>
                )}

                <Text style={[styles.subtitle, {color: text}]}>Sudah dikumpulkan oleh {task.submit} / {siswaKelas} mahasiswa </Text>

            </View>

            <View>
                <LinearGradient
                    colors={["#3252F4", "#23B3FA"]} 
                    style={styles.iconBox}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <Ionicons name="document-text" size={28} color="#fff" />
                </LinearGradient>
            </View>
      </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 18,
        marginTop: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 5,
    },
    iconBox: {
        backgroundColor: "#1e8df1",
        width: 70,
        height: 70,
        borderRadius: 18,      
        justifyContent: "center",
        alignItems: "center",
        marginRight: 0
    },
    info: { flex: 1, marginLeft: 14, flexDirection: "column", alignItems: "left" },
    title: { fontSize: 16, fontWeight: "600", color: "black" },
    subtitle: { fontSize: 13, color: "#666", marginTop: 5 },
});
   