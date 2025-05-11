const express = require('express');
const connectDB = require('./config/db');
const simulatedAuth = require('./middleware/simulatedAuth');
const studentRoutes = require('./routes/studentRoutes');
const driveRoutes = require('./routes/driveRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use(simulatedAuth); // Simulate authentication
app.use(cors());
// Add this missing line
app.use('/api/auth', authRoutes);

app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
