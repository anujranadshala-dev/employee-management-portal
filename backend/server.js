import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// --- Import Route Files ---
import apiRoutes from './index.js'; // Import the central router

// --- Environment Configuration ---
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Core Middleware ---
// 1. Enable Cross-Origin Resource Sharing for your frontend to communicate with the backend
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow cookies to be sent
}));
// 2. Enable JSON body parsing to accept data from POST/PATCH requests
app.use(express.json());
// 3. Enable cookie parsing
app.use(cookieParser());

// --- API Route Mounting ---
app.use('/api', apiRoutes); // Mount all API routes under the /api prefix

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