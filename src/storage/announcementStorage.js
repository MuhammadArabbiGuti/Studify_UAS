import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'STUDIFY_ANNOUNCEMENTS';

export async function saveAnnouncement(newAnnouncement) {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];
        const updated = Array.isArray(list) ? [...list, newAnnouncement] : [newAnnouncement];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error("Gagal menyimpan tugas:", e)
        return [];
    }
}

export async function loadAnnouncements() {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error("Gagal load Pemberitahuan", e);
        return [];
    }
}

export async function getAnnouncementById(id) {
    const Announcements = await loadAnnouncements();
    return Announcements.find(t => t.id === id) || null;
}