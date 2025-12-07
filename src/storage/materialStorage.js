import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'STUDIFY_MATERIALS';

export async function saveMaterial(newMaterial) {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];
        const updated = Array.isArray(list) ? [...list, newMaterial] : [newMaterial];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error("Gagal menyimpan tugas:", e)
        return [];
    }
}

export async function loadMaterials() {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error("Gagal load Materi", e);
        return [];
    }
}

export async function getMaterialById(id) {
    const Materials = await loadMaterials();
    return Materials.find(t => t.id === id) || null;
}