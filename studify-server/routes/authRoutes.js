import { Router } from 'express';
import { pool } from '../db/config.js';

const router = Router();

// POST /auth/login
// Mensimulasikan login untuk mendapatkan role dan ID yang benar
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cek user di tabel users
    const [users] = await pool.query(
      'SELECT userID, email, fullName, role, passwordHash FROM users WHERE email = ?', 
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const user = users[0];

    // NOTE: Di production, gunakan bcrypt.compare untuk password!
    // Untuk prototype ini kita bandingkan string langsung (Sesuai level taskmate)
    if (user.passwordHash !== password) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // 2. Ambil detail ID spesifik (studentID atau lecturerID)
    let profileData = {};
    
    if (user.role === 'student') {
      const [students] = await pool.query('SELECT studentID FROM students WHERE userID = ?', [user.userID]);
      if (students.length > 0) profileData = students[0];
    } else if (user.role === 'lecturer') {
      const [lecturers] = await pool.query('SELECT lecturerID FROM lecturers WHERE userID = ?', [user.userID]);
      if (lecturers.length > 0) profileData = lecturers[0];
    }

    // 3. Return data lengkap agar Frontend bisa menampilkan dashboard yang sesuai
    res.json({
      message: 'Login berhasil',
      user: {
        userID: user.userID,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        ...profileData // Akan berisi studentID atau lecturerID
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

export default router;