const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @param {string} mongoUri - MongoDB connection string
 */
const connectDB = async (mongoUri) => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

