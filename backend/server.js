import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import employeeRoutes from './routes/employeeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

// Connect Mongoose to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Log incoming requests in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`);
    next();
  });
}

// REST Routes
app.use('/api/employees', employeeRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Employee Management API is active' });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Express error boundary middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
