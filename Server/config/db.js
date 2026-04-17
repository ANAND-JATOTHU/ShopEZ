const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Attempt standard connection first with 2 seconds timeout
    if (process.env.MONGO_URI) {
      try {
        console.log('Attempting to connect to external/local MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.log(`Standard connection failed (${err.message}). Falling back to in-memory DB...`);
      }
    }
    
    // Fallback to mongodb-memory-server
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`Fallback in-memory MongoDB Connected. Data will be reset on restart.`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
