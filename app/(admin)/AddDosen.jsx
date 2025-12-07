import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { lecturerAPI } from "../../src/services/api";

export default function AddDosen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nip, setNip] = useState("");

    const [dosenList, setDosenList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        loadLecturers();
    }, []);

    const loadLecturers = async () => {
        try {
            setRefreshing(true);
            const response = await lecturerAPI.getAll();
            if (response.success) {
                setDosenList(response.data);
            }
        } catch (error) {
            Alert.alert("Error", "Gagal memuat data dosen: " + error.message);
        } finally {
            setRefreshing(false);
        }
    };

    const handleAddOrUpdateDosen = async () => {
        if (!name || !email || (!editMode && !password) || !nip) {
            return Alert.alert("Error", "Lengkapi semua data!");
        }

        try {
            setLoading(true);
            
            if (editMode) {
                const response = await lecturerAPI.update(editingId, {
                    lecturerNIP: nip,
                    lecturerName: name
                });
                
                if (response.success) {
                    Alert.alert("Sukses", "Dosen berhasil diupdate");
                    resetForm();
                    loadLecturers();
                }
            } else {
                const response = await lecturerAPI.create({
                    email,
                    password,
                    fullName: name,
                    lecturerNIP: nip,
                    lecturerName: name
                });
                
                if (response.success) {
                    Alert.alert("Sukses", "Dosen berhasil ditambahkan");
                    resetForm();
                    loadLecturers();
                }
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Gagal menyimpan data");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditMode(true);
        setEditingId(item.lecturerID);
        setName(item.lecturerName);
        setEmail(item.email);
        setNip(item.lecturerNIP);
    };

    const handleDeleteConfirm = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const response = await lecturerAPI.delete(deleteId);
            
            if (response.success) {
                Alert.alert("Sukses", "Dosen berhasil dihapus");
                setShowDeleteModal(false);
                loadLecturers();
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Gagal menghapus data");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setNip("");
        setEditMode(false);
        setEditingId(null);
    };

    return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Ionicons name={editMode ? "create" : "add"} size={30} color="#1a1a1a" />
                <Text style={styles.headerTitle}>
                    {editMode ? "Edit Dosen" : "Tambah Dosen"}
                </Text>
            </View>
            <Text style={styles.headerSubtitle}>Isi semua formulir dibawah ini!</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Nama Lengkap" 
            placeholderTextColor="#999"
            value={name} 
            onChangeText={setName} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor="#999"
            value={email} 
            onChangeText={setEmail}
            editable={!editMode}
            keyboardType="email-address" 
          />
          {!editMode && (
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor="#999"
              value={password} 
              onChangeText={setPassword}
              secureTextEntry 
            />
          )}
          <TextInput 
            style={styles.input} 
            placeholder="NIP (Nomor Induk Pegawai)" 
            placeholderTextColor="#999"
            value={nip} 
            onChangeText={setNip} 
          />

          <View style={styles.buttonRow}>
            {editMode && (
              <TouchableOpacity onPress={resetForm} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={handleAddOrUpdateDosen} 
              style={{ flex: 1 }}
              disabled={loading}
            >
              <LinearGradient
                colors={["#3252F4", "#23B3FA"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.submitBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>
                    {editMode ? "Update" : "Tambahkan"}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Daftar Dosen</Text>
            <TouchableOpacity onPress={loadLecturers}>
              <Ionicons name="refresh" size={22} color="#3252F4" />
            </TouchableOpacity>
          </View>
          
          {refreshing ? (
            <ActivityIndicator style={{ marginTop: 20 }} color="#3252F4" />
          ) : (
            dosenList.map((item) => (
              <View key={item.lecturerID.toString()} style={styles.lecturerCard}>
                <View style={styles.lecturerInfo}>
                  <Text style={styles.lecturerName}>{item.lecturerName}</Text>
                  <Text style={styles.lecturerDetail}>NIP: {item.lecturerNIP}</Text>
                  <Text style={styles.lecturerDetail}>{item.email}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.editBtn}
                    onPress={() => handleEdit(item)}
                  >
                    <Ionicons name="create-outline" size={20} color="#3252F4" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteConfirm(item.lecturerID)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="warning" size={50} color="#FF3B30" />
              <Text style={styles.modalTitle}>Hapus Dosen?</Text>
              <Text style={styles.modalText}>
                Data dosen akan dihapus permanen dan tidak dapat dikembalikan.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelBtn}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.modalCancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalDeleteBtn}
                  onPress={handleDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalDeleteText}>Hapus</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#F4F7FB",
      paddingHorizontal: 20,
      paddingTop: 25,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 18,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: "#1A1A1A",
    },
    headerSubtitle: {
      color: "#6F6F6F",
      fontSize: 13,
      marginTop: 2,
      marginBottom: 18,
    },
    input: {
      backgroundColor: "#F2F2F2",
      borderRadius: 10,
      padding: 14,
      marginTop: 10,
      fontSize: 14,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 18,
    },
    cancelBtn: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 14,
      backgroundColor: "#E0E0E0",
      alignItems: "center",
      justifyContent: "center",
    },
    cancelText: {
      color: "#666",
      fontSize: 16,
      fontWeight: "700",
    },
    submitBtn: {
      borderRadius: 12,
      paddingVertical: 14,
    },
    submitText: {
      textAlign: "center",
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
    divider: {
      height: 1,
      backgroundColor: "#E0E0E0",
      marginVertical: 25,
    },
    listHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#1A1A1A",
    },
    lecturerCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#F8F9FA",
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
    },
    lecturerInfo: {
      flex: 1,
    },
    lecturerName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#1A1A1A",
      marginBottom: 4,
    },
    lecturerDetail: {
      fontSize: 13,
      color: "#666",
      marginTop: 2,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 8,
    },
    editBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: "#E3EAFF",
    },
    deleteBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: "#FFE5E5",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 25,
      alignItems: "center",
      width: "100%",
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#1A1A1A",
      marginTop: 15,
      marginBottom: 10,
    },
    modalText: {
      fontSize: 14,
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 10,
      width: "100%",
    },
    modalCancelBtn: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      backgroundColor: "#E0E0E0",
      alignItems: "center",
    },
    modalCancelText: {
      color: "#666",
      fontSize: 16,
      fontWeight: "600",
    },
    modalDeleteBtn: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      backgroundColor: "#FF3B30",
      alignItems: "center",
    },
    modalDeleteText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
