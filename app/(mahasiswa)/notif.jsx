import { StyleSheet, Text, View } from "react-native";

export default function NotifScreen() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Notif</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center'
   },
    title: { fontSize: 18, fontWeight: '700' },
   });