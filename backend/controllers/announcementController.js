const db = require('../config/database');

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ann.*, c.className, u.fullName as createdByName
      FROM announcements ann
      JOIN class c ON ann.classID = c.classID
      LEFT JOIN users u ON ann.createdBy = u.userID
      ORDER BY ann.createdAt DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get announcements by class
exports.getAnnouncementsByClass = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ann.*, u.fullName as createdByName
      FROM announcements ann
      LEFT JOIN users u ON ann.createdBy = u.userID
      WHERE ann.classID = ?
      ORDER BY ann.createdAt DESC
    `, [req.params.classId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ann.*, c.className, u.fullName as createdByName
      FROM announcements ann
      JOIN class c ON ann.classID = c.classID
      LEFT JOIN users u ON ann.createdBy = u.userID
      WHERE ann.announcementID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { classID, title, description, createdBy } = req.body;
    const [result] = await db.query(
      'INSERT INTO announcements (classID, title, description, createdBy) VALUES (?, ?, ?, ?)',
      [classID, title, description, createdBy]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Announcement created successfully',
      data: { announcementID: result.insertId, title }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await db.query(
      'UPDATE announcements SET title = ?, description = ?, updatedAt = NOW() WHERE announcementID = ?',
      [title, description, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    
    res.json({ success: true, message: 'Announcement updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM announcements WHERE announcementID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
