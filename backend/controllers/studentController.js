const db = require('../config/database');

// Get all students with user info
exports.getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, u.email, u.fullName, u.isActive 
      FROM students s
      JOIN users u ON s.userID = u.userID
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, u.email, u.fullName, u.isActive 
      FROM students s
      JOIN users u ON s.userID = u.userID
      WHERE s.studentID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create student (with user)
exports.createStudent = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { email, password, fullName, studentNIM, studentName, studentGender } = req.body;
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user first
    const [userResult] = await connection.query(
      'INSERT INTO users (email, passwordHash, fullName, role) VALUES (?, ?, ?, ?)',
      [email, passwordHash, fullName, 'student']
    );
    
    const userID = userResult.insertId;
    
    // Create student
    const [studentResult] = await connection.query(
      'INSERT INTO students (userID, studentNIM, studentName, studentGender) VALUES (?, ?, ?, ?)',
      [userID, studentNIM, studentName || fullName, studentGender]
    );
    
    await connection.commit();
    
    res.status(201).json({ 
      success: true, 
      message: 'Student created successfully',
      data: { studentID: studentResult.insertId, userID, studentNIM, studentName }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { studentNIM, studentName, studentGender } = req.body;
    const [result] = await db.query(
      'UPDATE students SET studentNIM = ?, studentName = ?, studentGender = ? WHERE studentID = ?',
      [studentNIM, studentName, studentGender, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM students WHERE studentID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
