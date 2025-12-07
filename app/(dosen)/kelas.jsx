import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ClassItem from '../../src/components/ClassItem';
import { useTheme } from "../../src/context/ThemeContext";
import { dummyClasses } from '../../src/data/dummyClasses';

export default function ClassScreen() {
    const [classes, setClasses] = useState(dummyClasses);

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#0D0D0D" : "#FFFFFF";
    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    return(
        <ScrollView 
            contentContainerStyle={{paddingBottom: 20}} style={[styles.container, {backgroundColor: bg}]}>
            <View style={styles.classes}>
                <Text style={[styles.sectionTitle, {color: text}]}>Kelas yang diampu</Text>
                {classes.map(item => (<ClassItem key={item.id} kelas={item} />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#fff" },
    sectionTitle: { fontSize: 14, marginTop: 20, color: "#444" }
});