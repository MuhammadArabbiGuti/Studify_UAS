import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); // Parsing JSON body

// Health Check
app.get('/', (req, res) => {
  res.send('Studify Server is Running 🚀');
});

// Routes Registration
app.use('/auth', authRoutes);     // Login & Register
app.use('/classes', classRoutes); // Dashboard Kelas (Logic Role disini)

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});