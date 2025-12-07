const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const lecturerRoutes = require('./routes/lecturers');
const classRoutes = require('./routes/classes');
const enrollmentRoutes = require('./routes/enrollments');
const assignmentRoutes = require('./routes/assignments');
const materialRoutes = require('./routes/materials');
const announcementRoutes = require('./routes/announcements');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/announcements', announcementRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Studify API Server',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      students: '/api/students',
      lecturers: '/api/lecturers',
      classes: '/api/classes',
      enrollments: '/api/enrollments',
      assignments: '/api/assignments',
      materials: '/api/materials',
      announcements: '/api/announcements'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});
