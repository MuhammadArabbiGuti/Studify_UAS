import { useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from "../../src/context/ThemeContext";
import { useRole } from "../context/RoleContext";

export default function AnnouncementItem({ announcement }) {

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const [siswaTotal, setSiswaTotal] = useState(null);

    const { role } = useRole();

    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    return (
        <View style={[styles.card, {backgroundColor: card, borderColor: border, borderWidth: 1}]}>
            <View style={styles.info}>
                <Text style={[styles.title, {color: text}]}>{announcement.title}</Text>
                <Text style={[styles.subtitle, {color: text}]}>{announcement.kelas}</Text>
                <Text style={[styles.subtitle, {color: text}]}>Pertemuan: {announcement.session}</Text>
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
        shadowOpacity: 0.08,
        shadowRadius: 7,
    },
    iconBox: {
        backgroundColor: "#1e8df1",
        width: 50,
        height: 50,
        borderRadius: 18,      
        justifyContent: "center",
        alignItems: "center",
        marginRight: 0
    },
    info: { flex: 1, flexDirection: "column", alignItems: "left" },
    title: { fontSize: 16, fontWeight: "600", color: "black" },
    subtitle: { fontSize: 13, color: "#666", marginTop: 5 },
});
   