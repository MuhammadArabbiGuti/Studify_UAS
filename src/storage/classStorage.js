import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'STUDIFY_CLASSES';

export async function saveClass(newClass) {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];
        const updated = Array.isArray(list) ? [...list, newClass] : [newClass];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error("Gagal simpan kelas:", e)
        return [];
    }
}

export async function loadClasses() {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error("Gagal load kelas:", e);
        return [];
    }
}

export async function getClassById(id) {
    const classes = await loadClasses();
    return classes.find(c => c.id === id) || null;
}