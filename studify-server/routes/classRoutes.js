import { Router } from 'express';
import { pool } from '../db/config.js';

const router = Router();

// GET /classes?userID=...&role=...
// Endpoint "Sakti" untuk dashboard. Menampilkan daftar kelas berdasarkan Role.
router.get('/', async (req, res) => {
  // Kita ambil userID dan role dari query params (dikirim oleh frontend setelah login)
  const { userID, role } = req.query; 

  if (!userID || !role) {
    return res.status(400).json({ message: 'userID dan role diperlukan' });
  }

  try {
    let query = '';
    let params = [];

    if (role === 'admin') {
      // -----------------------------------------------------------
      // LOGIKA ADMIN: "Tampilan dashboard seluruh kelas aktif"
      // -----------------------------------------------------------
      query = `
        SELECT c.*, l.lecturerName, 
        (SELECT COUNT(*) FROM class_enrollments ce WHERE ce.classID = c.classID) as totalStudents
        FROM class c
        LEFT JOIN lecturers l ON c.lecturerID = l.lecturerID
        ORDER BY c.createdAt DESC
      `;
    } 
    
    else if (role === 'lecturer') {
      // -----------------------------------------------------------
      // LOGIKA DOSEN: "Dashboard daftar kelas yg diajar"
      // -----------------------------------------------------------
      // Kita perlu mencari lecturerID dari userID dulu
      const [lecturerCheck] = await pool.query('SELECT lecturerID FROM lecturers WHERE userID = ?', [userID]);
      
      if (lecturerCheck.length === 0) return res.json([]); // Belum terdaftar sebagai dosen
      
      const lecturerID = lecturerCheck[0].lecturerID;

      query = `
        SELECT c.*, 
        (SELECT COUNT(*) FROM class_enrollments ce WHERE ce.classID = c.classID) as totalStudents
        FROM class c
        WHERE c.lecturerID = ?
        ORDER BY c.className ASC
      `;
      params = [lecturerID];
    } 

    else if (role === 'student') {
      // -----------------------------------------------------------
      // LOGIKA SISWA: "Dashboard daftar kelas yang sedang diikuti"
      // -----------------------------------------------------------
      // Cari studentID dari userID
      const [studentCheck] = await pool.query('SELECT studentID FROM students WHERE userID = ?', [userID]);

      if (studentCheck.length === 0) return res.json([]);

      const studentID = studentCheck[0].studentID;

      // Join ke tabel enrollments untuk melihat kelas yang diambil siswa ini
      query = `
        SELECT c.*, l.lecturerName
        FROM class c
        JOIN class_enrollments ce ON c.classID = ce.classID
        LEFT JOIN lecturers l ON c.lecturerID = l.lecturerID
        WHERE ce.studentID = ?
        ORDER BY c.className ASC
      `;
      params = [studentID];
    }

    // Eksekusi Query yang sudah dipilih
    const [rows] = await pool.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ message: 'Gagal mengambil data kelas' });
  }
});

// GET /classes/:id
// Detail kelas (Announcement, Materials, Assignments)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // 1. Ambil Info Kelas
    const [classData] = await pool.query('SELECT * FROM class WHERE classID = ?', [id]);
    if (classData.length === 0) return res.status(404).json({ message: 'Kelas tidak ditemukan' });

    // 2. Ambil Announcements
    const [announcements] = await pool.query(
      'SELECT * FROM class_announcements WHERE classID = ? ORDER BY createdAt DESC', 
      [id]
    );

    // 3. Ambil Materials
    const [materials] = await pool.query(
      'SELECT * FROM class_materials WHERE classID = ? ORDER BY createdAt DESC', 
      [id]
    );

    // 4. Ambil Assignments
    const [assignments] = await pool.query(
      'SELECT * FROM class_assignments WHERE classID = ? ORDER BY deadline ASC', 
      [id]
    );

    res.json({
      details: classData[0],
      announcements,
      materials,
      assignments
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error mengambil detail kelas' });
  }
});

export default router;