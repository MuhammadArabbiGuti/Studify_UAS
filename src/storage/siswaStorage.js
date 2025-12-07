import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'STUDIFY_STUDENTS';

export async function loadSiswa() {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error('Gagal membaca', e);
        return [];
    }
}

export async function saveSiswa(newSiswa) {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];
        const updated = [...list, newSiswa];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error('Gagal menyimpan', e)
    }
}