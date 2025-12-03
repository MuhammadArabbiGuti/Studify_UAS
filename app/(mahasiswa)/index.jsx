import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CalendarView from '../../src/components/CalendarView';
import ClassItem from '../../src/components/ClassItem';
import TaskItem from '../../src/components/TaskItem';
import { useTheme } from "../../src/context/ThemeContext";
import { dummyClasses } from '../../src/data/dummyClasses';
import { dummyTasks } from '../../src/data/dummyTasks';

export default function HomeScreen() {
    const [classes, setClasses] = useState(dummyClasses);
    const [tasks, setTasks] = useState(dummyTasks);

    const [selectedDay, setSelectedDay] = useState(null);

    const scheduledClasses = selectedDay
    ? classes.filter(c => c.hari === selectedDay)
    : classes;

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#0D0D0D" : "#FFFFFF";
    const text = isDark ? "#FFFFFF" : "#1A1A1A";
    const border = isDark ? "#fff" : "#999";
    const card = isDark ? "#1A1A1A" : "#F4F4F4";

    return (
        <ScrollView 
        contentContainerStyle={{paddingBottom: 20}} style={[styles.container, {backgroundColor: bg}]}>
        <View style={styles.header}>
            <View>
                <Text style={styles.appName}>Studify</Text>
                <Text style={[styles.greeting, {color: text}]}>Selamat Datang, Mahasiswa!</Text>
            </View>
        <Ionicons name="qr-code-outline" size={28} />
        </View>
        
        <Text style={[styles.sectionTitle, {color: text}]}>Kelas hari ini</Text>
        {classes.map(item => (
          <ClassItem key={item.id} kelas={item} />
        ))}

        <Text style={[styles.sectionTitle, {color: text}]}>Tugas</Text>
        {tasks.map(item => (
          <TaskItem key={item.id} task={item} />
        ))}

        <CalendarView onDayChange={setSelectedDay} />
        {scheduledClasses.map(item => (
            <ClassItem key={item.id} kelas={item} />
        ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#fff" },
    header: { marginTop: 40, flexDirection: "row", justifyContent: "space-between" },
    appName: { color: "#1e8df1", fontSize: 24, fontWeight: "bold" },
    greeting: { fontSize: 14, marginTop: 2, color: "#444" },
    sectionTitle: { fontSize: 14, marginTop: 20, color: "#444" }
});
