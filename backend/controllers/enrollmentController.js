const db = require('../config/database');

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, c.className, s.studentName, u.fullName
      FROM enrollments e
      JOIN class c ON e.classID = c.classID
      JOIN students s ON e.studentID = s.studentID
      JOIN users u ON s.userID = u.userID
      ORDER BY e.enrolledAt DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Enroll student to class
exports.enrollStudent = async (req, res) => {
  try {
    const { classID, studentID } = req.body;
    const [result] = await db.query(
      'INSERT INTO enrollments (classID, studentID) VALUES (?, ?)',
      [classID, studentID]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Student enrolled successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await db.query(
      'UPDATE enrollments SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    
    res.json({ success: true, message: 'Enrollment status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM enrollments WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    
    res.json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get classes by student
exports.getClassesByStudent = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, e.enrolledAt, e.status
      FROM enrollments e
      JOIN class c ON e.classID = c.classID
      WHERE e.studentID = ? AND e.status = 'active'
    `, [req.params.studentId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get classes by lecturer
exports.getClassesByLecturer = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, cl.assignedAt
      FROM class_lecturers cl
      JOIN class c ON cl.classID = c.classID
      WHERE cl.lecturerID = ?
    `, [req.params.lecturerId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
