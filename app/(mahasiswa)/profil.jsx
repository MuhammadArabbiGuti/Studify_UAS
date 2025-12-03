import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../src/context/ThemeContext";

export default function ProfilScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#0D0D0D" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#1A1A1A";
  const border = isDark ? "#fff" : "#999";
  const card = isDark ? "#1A1A1A" : "#F4F4F4";

  return (
    <ScrollView style={[styles.container, {backgroundColor: bg}]}>

    <View style={styles.avatarWrapper}>
        <View style={styles.avatarCircle}>
            <Ionicons name="person" size={95} color="#fff" />
        </View>
        <TouchableOpacity style={styles.editAvatar}>
            <Ionicons name="pencil" size={20} color="black" />
        </TouchableOpacity>
    </View>

    <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Gender" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="No. handphone" placeholderTextColor="#888" />

        <View style={styles.modeRow}>
          <Text style={[styles.modeLabel, {color: text}]}>Mode</Text>

            <View style={[styles.modeToggle, { borderColor: border }]}>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconLeft}>
              <Ionicons
                name="sunny"
                size={20}
                color={isDark ? "#fff" : "#999"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconRight}>
              <Ionicons
                name="moon"
                size={20}
                color={isDark ? "#fff" : "#999"}
              />
            </TouchableOpacity>
            </View>
        </View>
    </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f7",
      paddingHorizontal: 22,
    },
    headerText: {
      marginTop: 8,
      fontSize: 15,
      fontWeight: "500",
      color: "#1a1a1a",
    },
    avatarWrapper: {
      alignItems: "center",
      marginTop: 25,
    },
    avatarCircle: {
      width: 150,
      height: 150,
      borderRadius: 100,
      backgroundColor: "#1e2432",
      justifyContent: "center",
      alignItems: "center",
    },
    editAvatar: {
      position: "absolute",
      bottom: 8,
      right: "32%",
      backgroundColor: "#fff",
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
    },
    form: {
      marginTop: 30,
      gap: 12,
    },
    input: {
      backgroundColor: "#ececed",
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 50,
      fontSize: 15,
    },
    modeRow: {
      marginTop: 10,
    },
    modeLabel: {
      marginBottom: 6,
      color: "#555",
    },
    modeToggle: {
      flexDirection: "row",
      borderWidth: 1,
      borderRadius: 14,
      height: 50,
      alignItems: "center",
      paddingHorizontal: 3,
    },
    iconLeft: {
      flex: 1,
      alignItems: "center",
    },
    iconRight: {
      flex: 1,
      alignItems: "center",
    },
  });
