const db = require('../config/database');

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM class ORDER BY createdAt DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get class by ID with lecturers and enrolled students
exports.getClassById = async (req, res) => {
  try {
    const [classData] = await db.query('SELECT * FROM class WHERE classID = ?', [req.params.id]);
    
    if (classData.length === 0) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    
    // Get lecturers
    const [lecturers] = await db.query(`
      SELECT l.*, u.fullName 
      FROM class_lecturers cl
      JOIN lecturers l ON cl.lecturerID = l.lecturerID
      JOIN users u ON l.userID = u.userID
      WHERE cl.classID = ?
    `, [req.params.id]);
    
    // Get enrolled students
    const [students] = await db.query(`
      SELECT s.*, u.fullName, e.enrolledAt, e.status
      FROM enrollments e
      JOIN students s ON e.studentID = s.studentID
      JOIN users u ON s.userID = u.userID
      WHERE e.classID = ? AND e.status = 'active'
    `, [req.params.id]);
    
    res.json({ 
      success: true, 
      data: {
        ...classData[0],
        lecturers,
        students
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create class
exports.createClass = async (req, res) => {
  try {
    const { className, classCode } = req.body;
    const [result] = await db.query(
      'INSERT INTO class (className, classCode) VALUES (?, ?)',
      [className, classCode]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Class created successfully',
      data: { classID: result.insertId, className, classCode }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const { className, classCode } = req.body;
    const [result] = await db.query(
      'UPDATE class SET className = ?, classCode = ? WHERE classID = ?',
      [className, classCode, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    
    res.json({ success: true, message: 'Class updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM class WHERE classID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    
    res.json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign lecturer to class
exports.assignLecturer = async (req, res) => {
  try {
    const { classID, lecturerID } = req.body;
    const [result] = await db.query(
      'INSERT INTO class_lecturers (classID, lecturerID) VALUES (?, ?)',
      [classID, lecturerID]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Lecturer assigned successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove lecturer from class
exports.removeLecturer = async (req, res) => {
  try {
    const { classID, lecturerID } = req.params;
    const [result] = await db.query(
      'DELETE FROM class_lecturers WHERE classID = ? AND lecturerID = ?',
      [classID, lecturerID]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    res.json({ success: true, message: 'Lecturer removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
