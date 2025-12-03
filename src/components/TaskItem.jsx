import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from "../../src/context/ThemeContext";

export default function TaskItem({ task }) {

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#0D0D0D" : "#FFFFFF";
    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    return (
        <View style={[styles.card, {backgroundColor: card, borderColor: border, borderWidth: 1}]}>
            <View style={styles.info}>
                <Text style={[styles.title, {color: text}]}>{task.title}</Text>
                <Text style={[styles.subtitle, {color: text}]}>{task.kelas}</Text>
                <Text style={[styles.subtitle, {color: text}]}>{task.deadline}</Text>
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
    info: { flex: 1, marginLeft: 14, flexDirection: "colum", alignItems: "left" },
    title: { fontSize: 16, fontWeight: "600", color: "black" },
    subtitle: { fontSize: 13, color: "#666" },
});
   