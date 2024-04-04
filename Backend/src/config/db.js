const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables; handle potential error
const env = dotenv.config();
if (env.error) {
    throw new Error("Failed to load the .env file");
}

// Extract the DATABASE_URL from process.env
const { DATABASE_URL } = process.env;

// A function to connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB Connection Established...');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
