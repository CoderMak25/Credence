const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { seedData } = require('./data/seed');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const studentRoutes = require('./routes/studentRoutes');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/students', studentRoutes);

// MongoDB Connection
const startServer = async () => {
  let mongoUri = process.env.MONGODB_URI;

  // Try to connect to local/env MongoDB first
  try {
    if (!mongoUri) {
      // Default local URI if not in env
      mongoUri = 'mongodb://localhost:27017/academic-risk-advisor';
    }

    // Attempt connection to standard URI
    console.log(`Trying to connect to database`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to Standard MongoDB');
  } catch (err) {
    console.log('⚠️ Standard MongoDB not found. Starting In-Memory MongoDB...');
    // Fallback to memory server
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      console.log(`📝 In-memory MongoDB URI: ${memoryUri}`);
      await mongoose.connect(memoryUri);
      console.log('✅ Connected to In-Memory MongoDB');

      // Auto-seed for memory server
      console.log('🌱 Seeding in-memory database...');
      await seedData();

    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr);
      process.exit(1);
    }
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
