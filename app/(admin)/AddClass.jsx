import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { classAPI, lecturerAPI, studentAPI, enrollmentAPI } from '../../src/services/api';

export default function AddClass() {
    const [className, setClassName] = useState("");
    const [classCode, setClassCode] = useState("");
    const [selectedLecturer, setSelectedLecturer] = useState("");
    const [selectedLecturerName, setSelectedLecturerName] = useState("");

    const [classList, setClassList] = useState([]);
    const [lecturerList, setLecturerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showLecturerModal, setShowLecturerModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [enrollingClassId, setEnrollingClassId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([loadClasses(), loadLecturers(), loadStudents()]);
    };

    const loadClasses = async () => {
        try {
            setRefreshing(true);
            const response = await classAPI.getAll();
            if (response.success) {
                setClassList(response.data);
            }
        } catch (error) {
            Alert.alert("Error", "Gagal memuat data kelas: " + error.message);
        } finally {
            setRefreshing(false);
        }
    };

    const loadStudents = async () => {
        try {
            const response = await studentAPI.getAll();
            if (response.success && response.data) {
                setStudentList(response.data);
                console.log(`✅ ${response.data.length} students loaded successfully`);
            }
        } catch (error) {
            console.error("❌ Error loading students:", error);
        }
    };

    const loadLecturers = async () => {
        try {
            console.log("🔄 Loading lecturers from API...");
            const response = await lecturerAPI.getAll();
            console.log("✅ Lecturer API Response:", JSON.stringify(response, null, 2));
            
            if (response.success && response.data) {
                setLecturerList(response.data);
                console.log(`✅ ${response.data.length} lecturers loaded successfully`);
            } else {
                console.log("⚠️ No lecturers found in response");
                setLecturerList([]);
            }
        } catch (error) {
            console.error("❌ Error loading lecturers:", error);
            Alert.alert(
                "Error", 
                "Gagal memuat data dosen. Pastikan backend server sudah berjalan.\n\n" + error.message
            );
            setLecturerList([]);
        }
    };

    const handleAddOrUpdateClass = async () => {
        if (!className || !classCode) {
            return Alert.alert("Error", "Nama kelas dan kode kelas harus diisi!");
        }

        try {
            setLoading(true);
            
            if (editMode) {
                const response = await classAPI.update(editingId, {
                    className,
                    classCode
                });
                
                if (response.success) {
                    Alert.alert("Sukses", "Kelas berhasil diupdate");
                    resetForm();
                    loadClasses();
                }
            } else {
                const response = await classAPI.create({
                    className,
                    classCode
                });
                
                if (response.success && selectedLecturer) {
                    // Assign lecturer to class
                    await classAPI.assignLecturer({
                        classID: response.data.classID,
                        lecturerID: selectedLecturer
                    });
                    Alert.alert("Sukses", "Kelas berhasil ditambahkan dengan dosen");
                } else if (response.success) {
                    Alert.alert("Sukses", "Kelas berhasil ditambahkan");
                }
                
                resetForm();
                loadClasses();
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Gagal menyimpan data");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditMode(true);
        setEditingId(item.classID);
        setClassName(item.className);
        setClassCode(item.classCode);
    };

    const handleDeleteConfirm = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const response = await classAPI.delete(deleteId);
            
            if (response.success) {
                Alert.alert("Sukses", "Kelas berhasil dihapus");
                setShowDeleteModal(false);
                loadClasses();
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Gagal menghapus data");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (classId) => {
        try {
            setLoading(true);
            const response = await classAPI.getById(classId);
            if (response.success) {
                setSelectedClass(response.data);
                setShowDetailModal(true);
            }
        } catch (error) {
            Alert.alert("Error", "Gagal memuat detail kelas");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setClassName("");
        setClassCode("");
        setSelectedLecturer("");
        setSelectedLecturerName("");
        setEditMode(false);
        setEditingId(null);
    };

    const handleSelectLecturer = (lecturer) => {
        setSelectedLecturer(lecturer.lecturerID);
        setSelectedLecturerName(lecturer.lecturerName || lecturer.fullName);
        setShowLecturerModal(false);
        console.log("✅ Selected:", lecturer.lecturerName, "ID:", lecturer.lecturerID);
    };

    const handleOpenStudentModal = async (classId) => {
        try {
            setEnrollingClassId(classId);
            setSelectedStudents([]);
            setEnrolledStudents([]);
            setLoading(true);
            
            // Get class details to find enrolled students
            const response = await classAPI.getById(classId);
            if (response.success && response.data.students) {
                // Extract student IDs who are already enrolled
                const enrolledIds = response.data.students.map(s => s.studentID);
                setSelectedStudents(enrolledIds);
                setEnrolledStudents(enrolledIds);
                console.log(`✅ ${enrolledIds.length} students already enrolled in this class`);
            }
            
            setShowStudentModal(true);
        } catch (error) {
            console.error("Error loading enrolled students:", error);
            setShowStudentModal(true); // Still open modal even if error
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStudent = (studentId) => {
        // Allow toggling for all students
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleUpdateEnrollments = async () => {
        try {
            setLoading(true);
            
            // Students to add (selected but not enrolled)
            const toAdd = selectedStudents.filter(id => !enrolledStudents.includes(id));
            
            // Students to remove (enrolled but not selected)
            const toRemove = enrolledStudents.filter(id => !selectedStudents.includes(id));
            
            let addCount = 0;
            let removeCount = 0;
            let errorCount = 0;

            // Add new students
            for (const studentId of toAdd) {
                try {
                    await enrollmentAPI.enroll({
                        classID: enrollingClassId,
                        studentID: studentId
                    });
                    addCount++;
                } catch (error) {
                    errorCount++;
                    console.error(`Failed to enroll student ${studentId}:`, error);
                }
            }

            // Remove unchecked students
            for (const studentId of toRemove) {
                try {
                    // Find enrollment ID by getting enrollments
                    const enrollments = await enrollmentAPI.getAll();
                    const enrollment = enrollments.data?.find(
                        e => e.classID === enrollingClassId && e.studentID === studentId
                    );
                    
                    if (enrollment) {
                        await enrollmentAPI.delete(enrollment.id);
                        removeCount++;
                    }
                } catch (error) {
                    errorCount++;
                    console.error(`Failed to remove student ${studentId}:`, error);
                }
            }

            // Show result
            const messages = [];
            if (addCount > 0) messages.push(`${addCount} mahasiswa ditambahkan`);
            if (removeCount > 0) messages.push(`${removeCount} mahasiswa dikeluarkan`);
            if (errorCount > 0) messages.push(`${errorCount} gagal`);
            
            if (addCount > 0 || removeCount > 0) {
                Alert.alert("Sukses", messages.join(', '));
                setShowStudentModal(false);
                setSelectedStudents([]);
                setEnrolledStudents([]);
                loadClasses();
            } else if (errorCount > 0) {
                Alert.alert("Error", "Gagal mengupdate enrollment");
            } else {
                Alert.alert("Info", "Tidak ada perubahan");
                setShowStudentModal(false);
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Gagal menambahkan mahasiswa");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Ionicons name={editMode ? "create" : "add"} size={30} color="#1A1A1A" />
                    <Text style={styles.headerTitle}>
                        {editMode ? "Edit Kelas" : "Tambah Kelas"}
                    </Text>
                </View>
                <Text style={styles.headerSubtitle}>Isi semua formulir dibawah ini!</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nama Kelas (contoh: Pemrograman Web Lanjut)"
                    placeholderTextColor="#999"
                    value={className}
                    onChangeText={setClassName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Kode Kelas (contoh: PWL-2024-A)"
                    placeholderTextColor="#999"
                    value={classCode}
                    onChangeText={setClassCode}
                />

                {!editMode && (
                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Dosen Pengampu (Opsional):</Text>
                        <Text style={styles.subLabel}>
                            {lecturerList.length > 0 
                                ? `✓ ${lecturerList.length} dosen tersedia` 
                                : "⚠️ Tidak ada data dosen. Pastikan backend running."}
                        </Text>
                        
                        {lecturerList.length > 0 ? (
                            <TouchableOpacity 
                                style={styles.dropdownButton}
                                onPress={() => setShowLecturerModal(true)}
                            >
                                <Text style={selectedLecturer ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                                    {selectedLecturerName || "-- Pilih Dosen (Maksimal 1) --"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#3252F4" />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.emptyPicker}>
                                <Ionicons name="warning-outline" size={24} color="#FF9800" />
                                <Text style={styles.emptyText}>
                                    Data dosen tidak tersedia.{"\n"}
                                    Silakan jalankan backend server terlebih dahulu.
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.buttonRow}>
                    {editMode && (
                        <TouchableOpacity onPress={resetForm} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Batal</Text>
                        </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                        onPress={handleAddOrUpdateClass} 
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
                    <Text style={styles.listTitle}>Daftar Kelas</Text>
                    <TouchableOpacity onPress={loadClasses}>
                        <Ionicons name="refresh" size={22} color="#3252F4" />
                    </TouchableOpacity>
                </View>

                {refreshing ? (
                    <ActivityIndicator style={{ marginTop: 20 }} color="#3252F4" />
                ) : (
                    classList.map((item) => (
                        <View key={item.classID.toString()} style={styles.classCard}>
                            <TouchableOpacity 
                                style={styles.classInfo}
                                onPress={() => handleViewDetail(item.classID)}
                            >
                                <Text style={styles.className}>{item.className}</Text>
                                <Text style={styles.classDetail}>Kode: {item.classCode}</Text>
                                <Text style={styles.classDetail}>
                                    Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity 
                                    style={styles.addStudentBtn}
                                    onPress={() => handleOpenStudentModal(item.classID)}
                                >
                                    <Ionicons name="person-add-outline" size={20} color="#8B5CF6" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.viewBtn}
                                    onPress={() => handleViewDetail(item.classID)}
                                >
                                    <Ionicons name="eye-outline" size={20} color="#10B981" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.editBtn}
                                    onPress={() => handleEdit(item)}
                                >
                                    <Ionicons name="create-outline" size={20} color="#3252F4" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.deleteBtn}
                                    onPress={() => handleDeleteConfirm(item.classID)}
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
                        <Text style={styles.modalTitle}>Hapus Kelas?</Text>
                        <Text style={styles.modalText}>
                            Data kelas akan dihapus permanen dan tidak dapat dikembalikan.
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

            {/* Detail Modal */}
            <Modal
                visible={showDetailModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDetailModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                        <TouchableOpacity 
                            style={styles.closeBtn}
                            onPress={() => setShowDetailModal(false)}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        
                        {selectedClass && (
                            <ScrollView>
                                <Text style={styles.modalTitle}>{selectedClass.className}</Text>
                                <Text style={styles.classDetail}>Kode: {selectedClass.classCode}</Text>
                                
                                <View style={styles.detailSection}>
                                    <Text style={styles.sectionTitle}>
                                        <Ionicons name="person" size={18} /> Dosen Pengampu
                                    </Text>
                                    {selectedClass.lecturers && selectedClass.lecturers.length > 0 ? (
                                        selectedClass.lecturers.map((lecturer, index) => (
                                            <Text key={index} style={styles.detailText}>
                                                • {lecturer.fullName}
                                            </Text>
                                        ))
                                    ) : (
                                        <Text style={styles.detailText}>Belum ada dosen</Text>
                                    )}
                                </View>

                                <View style={styles.detailSection}>
                                    <Text style={styles.sectionTitle}>
                                        <Ionicons name="people" size={18} /> Mahasiswa Terdaftar ({selectedClass.students?.length || 0})
                                    </Text>
                                    {selectedClass.students && selectedClass.students.length > 0 ? (
                                        selectedClass.students.map((student, index) => (
                                            <Text key={index} style={styles.detailText}>
                                                • {student.fullName} ({student.studentNIM})
                                            </Text>
                                        ))
                                    ) : (
                                        <Text style={styles.detailText}>Belum ada mahasiswa</Text>
                                    )}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Lecturer Selection Modal */}
            <Modal
                visible={showLecturerModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowLecturerModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '70%', width: '90%' }]}>
                        <TouchableOpacity 
                            style={styles.closeBtn}
                            onPress={() => setShowLecturerModal(false)}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        
                        <Text style={styles.modalTitle}>Pilih Dosen Pengampu</Text>
                        <Text style={styles.modalSubtitle}>Maksimal 1 dosen per kelas</Text>
                        
                        <ScrollView style={{ width: '100%', marginTop: 15 }}>
                            <TouchableOpacity 
                                style={[styles.lecturerOption, !selectedLecturer && styles.lecturerOptionSelected]}
                                onPress={() => {
                                    setSelectedLecturer("");
                                    setSelectedLecturerName("");
                                    setShowLecturerModal(false);
                                }}
                            >
                                <Ionicons 
                                    name={!selectedLecturer ? "radio-button-on" : "radio-button-off"} 
                                    size={24} 
                                    color={!selectedLecturer ? "#3252F4" : "#999"} 
                                />
                                <View style={styles.lecturerInfo}>
                                    <Text style={styles.lecturerOptionText}>Tidak ada dosen</Text>
                                    <Text style={styles.lecturerOptionSubtext}>Kelas tanpa dosen pengampu</Text>
                                </View>
                            </TouchableOpacity>

                            {lecturerList.map((lecturer) => (
                                <TouchableOpacity 
                                    key={lecturer.lecturerID}
                                    style={[
                                        styles.lecturerOption,
                                        selectedLecturer === lecturer.lecturerID && styles.lecturerOptionSelected
                                    ]}
                                    onPress={() => handleSelectLecturer(lecturer)}
                                >
                                    <Ionicons 
                                        name={selectedLecturer === lecturer.lecturerID ? "radio-button-on" : "radio-button-off"} 
                                        size={24} 
                                        color={selectedLecturer === lecturer.lecturerID ? "#3252F4" : "#999"} 
                                    />
                                    <View style={styles.lecturerInfo}>
                                        <Text style={styles.lecturerOptionText}>
                                            {lecturer.lecturerName || lecturer.fullName}
                                        </Text>
                                        <Text style={styles.lecturerOptionSubtext}>
                                            NIP: {lecturer.lecturerNIP}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Student Enrollment Modal */}
            <Modal
                visible={showStudentModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStudentModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '80%', width: '90%' }]}>
                        <TouchableOpacity 
                            style={styles.closeBtn}
                            onPress={() => setShowStudentModal(false)}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        
                        <Text style={styles.modalTitle}>Kelola Mahasiswa Kelas</Text>
                        <Text style={styles.modalSubtitle}>
                            {selectedStudents.length} mahasiswa terpilih • Centang untuk tambah, Uncheck untuk keluarkan
                        </Text>
                        
                        <ScrollView style={{ width: '100%', marginTop: 15, marginBottom: 15 }}>
                            {studentList.map((student) => {
                                const isSelected = selectedStudents.includes(student.studentID);
                                const isAlreadyEnrolled = enrolledStudents.includes(student.studentID);
                                
                                return (
                                    <TouchableOpacity 
                                        key={student.studentID}
                                        style={[
                                            styles.studentOption,
                                            isSelected && styles.studentOptionSelected
                                        ]}
                                        onPress={() => handleToggleStudent(student.studentID)}
                                    >
                                        <Ionicons 
                                            name={isSelected ? "checkbox" : "square-outline"} 
                                            size={24} 
                                            color={isSelected ? "#3252F4" : "#999"} 
                                        />
                                        <View style={styles.studentInfo}>
                                            <Text style={styles.studentOptionText}>
                                                {student.studentName || student.fullName}
                                                {isAlreadyEnrolled && " (Saat ini terdaftar)"}
                                            </Text>
                                            <Text style={styles.studentOptionSubtext}>
                                                NIM: {student.studentNIM}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={styles.modalCancelBtn}
                                onPress={() => setShowStudentModal(false)}
                            >
                                <Text style={styles.modalCancelText}>Batal</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.modalConfirmBtn}
                                onPress={handleUpdateEnrollments}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.modalConfirmText}>
                                        Update ({selectedStudents.length} terpilih)
                                    </Text>
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
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
        marginTop: 10,
        marginBottom: 8,
    },
    subLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 8,
    },
    pickerContainer: {
        marginTop: 10,
    },
    dropdownButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#3252F4",
        paddingHorizontal: 15,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownTextPlaceholder: {
        fontSize: 14,
        color: "#999",
    },
    dropdownTextSelected: {
        fontSize: 14,
        color: "#1A1A1A",
        fontWeight: "600",
    },
    pickerWrapper: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#3252F4",
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        width: "100%",
        color: "#1A1A1A",
        fontSize: 14,
    },
    pickerItem: {
        fontSize: 14,
        height: 50,
        color: "#1A1A1A",
    },
    emptyPicker: {
        backgroundColor: "#FFF3E0",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFB74D",
    },
    emptyText: {
        fontSize: 13,
        color: "#F57C00",
        textAlign: "center",
        marginTop: 10,
        lineHeight: 20,
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
    classCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    classInfo: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    classDetail: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 8,
    },
    addStudentBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#EDE9FE",
    },
    viewBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#D1FAE5",
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
    closeBtn: {
        position: "absolute",
        top: 15,
        right: 15,
        zIndex: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginTop: 15,
        marginBottom: 10,
        textAlign: "center",
    },
    modalText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    modalSubtitle: {
        fontSize: 13,
        color: "#666",
        textAlign: "center",
        marginTop: 5,
    },
    lecturerOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 12,
        backgroundColor: "#F8F9FA",
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    lecturerOptionSelected: {
        backgroundColor: "#E3EAFF",
        borderColor: "#3252F4",
    },
    lecturerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    lecturerOptionText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 3,
    },
    lecturerOptionSubtext: {
        fontSize: 13,
        color: "#666",
    },
    studentOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 12,
        backgroundColor: "#F8F9FA",
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    studentOptionSelected: {
        backgroundColor: "#E3EAFF",
        borderColor: "#3252F4",
    },
    studentOptionDisabled: {
        backgroundColor: "#D1FAE5",
        borderColor: "#10B981",
        opacity: 0.7,
    },
    studentInfo: {
        flex: 1,
        marginLeft: 12,
    },
    studentOptionText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 3,
    },
    studentOptionSubtext: {
        fontSize: 13,
        color: "#666",
    },
    textDisabled: {
        color: "#10B981",
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
    modalConfirmBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#3252F4",
        alignItems: "center",
    },
    modalConfirmBtnDisabled: {
        backgroundColor: "#B0B0B0",
    },
    modalConfirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    detailSection: {
        marginTop: 20,
        width: "100%",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 10,
    },
    detailText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
});
