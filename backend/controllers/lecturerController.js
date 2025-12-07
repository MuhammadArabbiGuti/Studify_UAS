const db = require('../config/database');

// Get all lecturers with user info
exports.getAllLecturers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, u.email, u.fullName, u.isActive 
      FROM lecturers l
      JOIN users u ON l.userID = u.userID
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get lecturer by ID
exports.getLecturerById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, u.email, u.fullName, u.isActive 
      FROM lecturers l
      JOIN users u ON l.userID = u.userID
      WHERE l.lecturerID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lecturer not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create lecturer (with user)
exports.createLecturer = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { email, password, fullName, lecturerNIP, lecturerName } = req.body;
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user first
    const [userResult] = await connection.query(
      'INSERT INTO users (email, passwordHash, fullName, role) VALUES (?, ?, ?, ?)',
      [email, passwordHash, fullName, 'lecturer']
    );
    
    const userID = userResult.insertId;
    
    // Create lecturer
    const [lecturerResult] = await connection.query(
      'INSERT INTO lecturers (userID, lecturerNIP, lecturerName) VALUES (?, ?, ?)',
      [userID, lecturerNIP, lecturerName || fullName]
    );
    
    await connection.commit();
    
    res.status(201).json({ 
      success: true, 
      message: 'Lecturer created successfully',
      data: { lecturerID: lecturerResult.insertId, userID, lecturerNIP, lecturerName }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Update lecturer
exports.updateLecturer = async (req, res) => {
  try {
    const { lecturerNIP, lecturerName } = req.body;
    const [result] = await db.query(
      'UPDATE lecturers SET lecturerNIP = ?, lecturerName = ? WHERE lecturerID = ?',
      [lecturerNIP, lecturerName, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Lecturer not found' });
    }
    
    res.json({ success: true, message: 'Lecturer updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete lecturer
exports.deleteLecturer = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM lecturers WHERE lecturerID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Lecturer not found' });
    }
    
    res.json({ success: true, message: 'Lecturer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
