import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'STUDIFY_TEACHERS';

export async function loadDosen() {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error('Gagal membaca', e);
        return [];
    }
}

export async function saveDosen(newDosen) {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];
        const updated = [...list, newDosen];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error('Gagal menyimpan', e)
    }
}