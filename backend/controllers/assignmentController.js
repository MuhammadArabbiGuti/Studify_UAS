const db = require('../config/database');

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, c.className, u.fullName as createdByName
      FROM assignments a
      JOIN class c ON a.classID = c.classID
      LEFT JOIN users u ON a.createdBy = u.userID
      ORDER BY a.createdAt DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get assignments by class
exports.getAssignmentsByClass = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, u.fullName as createdByName
      FROM assignments a
      LEFT JOIN users u ON a.createdBy = u.userID
      WHERE a.classID = ?
      ORDER BY a.deadline ASC
    `, [req.params.classId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get assignment by ID with submissions
exports.getAssignmentById = async (req, res) => {
  try {
    const [assignment] = await db.query(`
      SELECT a.*, c.className, u.fullName as createdByName
      FROM assignments a
      JOIN class c ON a.classID = c.classID
      LEFT JOIN users u ON a.createdBy = u.userID
      WHERE a.assignmentID = ?
    `, [req.params.id]);
    
    if (assignment.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    // Get submissions
    const [submissions] = await db.query(`
      SELECT asub.*, s.studentName, u.fullName
      FROM assignment_submissions asub
      JOIN students s ON asub.studentID = s.studentID
      JOIN users u ON s.userID = u.userID
      WHERE asub.assignmentID = ?
    `, [req.params.id]);
    
    res.json({ 
      success: true, 
      data: {
        ...assignment[0],
        submissions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const { classID, title, description, deadline, createdBy } = req.body;
    const [result] = await db.query(
      'INSERT INTO assignments (classID, title, description, deadline, createdBy) VALUES (?, ?, ?, ?, ?)',
      [classID, title, description, deadline, createdBy]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Assignment created successfully',
      data: { assignmentID: result.insertId, title }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const [result] = await db.query(
      'UPDATE assignments SET title = ?, description = ?, deadline = ? WHERE assignmentID = ?',
      [title, description, deadline, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    res.json({ success: true, message: 'Assignment updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM assignments WHERE assignmentID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentID, studentID, textResponse } = req.body;
    
    // Check if already submitted
    const [existing] = await db.query(
      'SELECT * FROM assignment_submissions WHERE assignmentID = ? AND studentID = ?',
      [assignmentID, studentID]
    );
    
    if (existing.length > 0) {
      // Update existing submission
      const [result] = await db.query(
        'UPDATE assignment_submissions SET textResponse = ?, status = ?, submittedAt = NOW() WHERE submissionID = ?',
        [textResponse, 'resubmitted', existing[0].submissionID]
      );
      
      return res.json({ 
        success: true, 
        message: 'Assignment resubmitted successfully',
        data: { submissionID: existing[0].submissionID }
      });
    }
    
    // Check if late
    const [assignment] = await db.query('SELECT deadline FROM assignments WHERE assignmentID = ?', [assignmentID]);
    const isLate = assignment[0].deadline && new Date() > new Date(assignment[0].deadline);
    
    const [result] = await db.query(
      'INSERT INTO assignment_submissions (assignmentID, studentID, textResponse, status) VALUES (?, ?, ?, ?)',
      [assignmentID, studentID, textResponse, isLate ? 'late' : 'submitted']
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Assignment submitted successfully',
      data: { submissionID: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Grade submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const [result] = await db.query(
      'UPDATE assignment_submissions SET grade = ?, feedback = ?, status = ? WHERE submissionID = ?',
      [grade, feedback, 'graded', req.params.submissionId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    res.json({ success: true, message: 'Submission graded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get submissions by student
exports.getSubmissionsByStudent = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT asub.*, a.title, a.deadline, c.className
      FROM assignment_submissions asub
      JOIN assignments a ON asub.assignmentID = a.assignmentID
      JOIN class c ON a.classID = c.classID
      WHERE asub.studentID = ?
      ORDER BY asub.submittedAt DESC
    `, [req.params.studentId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
