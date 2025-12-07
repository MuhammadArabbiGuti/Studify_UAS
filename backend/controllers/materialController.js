const db = require('../config/database');

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, c.className, u.fullName as createdByName
      FROM materials m
      JOIN class c ON m.classID = c.classID
      LEFT JOIN users u ON m.createdBy = u.userID
      ORDER BY m.createdAt DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get materials by class
exports.getMaterialsByClass = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, u.fullName as createdByName
      FROM materials m
      LEFT JOIN users u ON m.createdBy = u.userID
      WHERE m.classID = ?
      ORDER BY m.createdAt DESC
    `, [req.params.classId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, c.className, u.fullName as createdByName
      FROM materials m
      JOIN class c ON m.classID = c.classID
      LEFT JOIN users u ON m.createdBy = u.userID
      WHERE m.materialID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create material
exports.createMaterial = async (req, res) => {
  try {
    const { classID, title, description, fileURL, createdBy } = req.body;
    const [result] = await db.query(
      'INSERT INTO materials (classID, title, description, fileURL, createdBy) VALUES (?, ?, ?, ?, ?)',
      [classID, title, description, fileURL, createdBy]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Material created successfully',
      data: { materialID: result.insertId, title }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update material
exports.updateMaterial = async (req, res) => {
  try {
    const { title, description, fileURL } = req.body;
    const [result] = await db.query(
      'UPDATE materials SET title = ?, description = ?, fileURL = ? WHERE materialID = ?',
      [title, description, fileURL, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    
    res.json({ success: true, message: 'Material updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM materials WHERE materialID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
