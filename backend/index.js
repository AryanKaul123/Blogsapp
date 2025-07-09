import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Get __dirname for ES modules
const __dirname = path.resolve();

// ✅ Optional security headers (without Cross-Origin-Opener-Policy)
app.use(helmet({
  crossOriginOpenerPolicy: false,  // Critical to avoid window.close error
}));

// ✅ Proper CORS config
const allowedOrigins = [
  "https://blogsapp-1-k1ti.onrender.com",   // Your deployed frontend
  process.env.CLIENT_URL                    // In case you also use local frontend
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Parse JSON & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// ✅ Serve static frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
