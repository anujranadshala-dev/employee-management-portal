import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// --- Import Route Files ---
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import announcementRoutes from './routes/announcements.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import leaveRoutes from './routes/leave.routes.js';

// --- Environment Configuration ---
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Core Middleware ---
// 1. Enable Cross-Origin Resource Sharing for your frontend to communicate with the backend
app.use(cors());
// 2. Enable JSON body parsing to accept data from POST/PATCH requests
app.use(express.json());

// --- API Route Mounting ---
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave', leaveRoutes);

// --- Database Connection & Server Startup ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employeePortalDB')
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed.', err);
    process.exit(1);
  });