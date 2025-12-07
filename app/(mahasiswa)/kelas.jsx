import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ClassItem from '../../src/components/ClassItem';
import { useTheme } from "../../src/context/ThemeContext";
import { loadClasses } from '../../src/storage/classStorage';

export default function ClassScreen() {
    const [classList, setClassList] = useState([]);

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#0D0D0D" : "#FFFFFF";
    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    useEffect(() => {
        (async () => {
            try {
                const data = await loadClasses();
                console.log("loadClasses result:", data);
                console.log("type:", typeof data, "isArray:", Array.isArray(data));
                setClassList(data);
            } catch (e) {
                console.error("Error loadClasses:", e);
            }
        })();
    }, []);

    return(
        <ScrollView 
            contentContainerStyle={{paddingBottom: 20}} style={[styles.container, {backgroundColor: bg}]}>
            <View style={styles.classList}>
                <Text style={[styles.sectionTitle, {color: text}]}>Kelas yang diambil</Text>
                {classList.map(item => (<ClassItem key={item.id} kelas={item} />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#fff" },
    sectionTitle: { fontSize: 14, marginTop: 20, color: "#444" }
});