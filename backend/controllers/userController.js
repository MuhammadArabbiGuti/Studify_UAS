const db = require('../config/database');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT userID, email, fullName, role, isActive, createdAt FROM users');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT userID, email, fullName, role, isActive, createdAt FROM users WHERE userID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO users (email, passwordHash, fullName, role) VALUES (?, ?, ?, ?)',
      [email, passwordHash, fullName, role]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: { userID: result.insertId, email, fullName, role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { email, fullName, role, isActive } = req.body;
    const [result] = await db.query(
      'UPDATE users SET email = ?, fullName = ?, role = ?, isActive = ? WHERE userID = ?',
      [email, fullName, role, isActive, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE userID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }
    
    // Return user data without password
    const { passwordHash, ...userData } = user;
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
