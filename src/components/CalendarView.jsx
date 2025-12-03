import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarView({ onDayChange }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const getDayName = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("id-ID", { weekday: "long" });
  };

  const handleSelect = (dateString) => {
    const weekday = getDayName(dateString);
    const formatted = weekday.charAt(0).toUpperCase() + weekday.slice(1); 
    setSelectedDay(formatted);
    onDayChange(formatted);      
    setShowCalendar(false);      
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dateDropdown}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <Text style={styles.dropdownText}>
          {selectedDay ? selectedDay : "Pilih Hari"}
        </Text>
        <Ionicons name={showCalendar ? "chevron-up" : "chevron-down"} size={20} />
      </TouchableOpacity>

      {showCalendar && (
        <Calendar
          onDayPress={(day) => handleSelect(day.dateString)}
          style={styles.calendar}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 30, marginBottom: 20 },
  dateDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F4F7FE"
  },
  dropdownText: { fontSize: 16, fontWeight: "500" },
  calendar: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 10
  }
});
