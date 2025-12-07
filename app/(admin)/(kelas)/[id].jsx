import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { loadClasses } from "../../../src/storage/classStorage";
import { loadSiswa } from "../../../src/storage/siswaStorage";

export default function DetailKelasAdmin() {
  const { id } = useLocalSearchParams();
  const [kelas, setKelas] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const kelasList = await loadClasses();
      const studentList = await loadSiswa();

      const foundKelas = kelasList.find(k => k.id === id);
      setKelas(foundKelas);

      const filtered = studentList.filter(s => foundKelas.mahasiswa.includes(s.id));
      setStudents(filtered);
    }
    fetchData();
  }, []);
}
