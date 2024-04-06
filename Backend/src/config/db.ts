import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables; handle potential error
const env = dotenv.config();
if (env.error) {
    throw new Error("Failed to load the .env file");
}

// Assert that DATABASE_URL is set
const DATABASE_URL = process.env.DATABASE_URL!;

// A function to connect to the database
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB Connection Established...');
  } catch (err) {
    console.error('Database connection failed:', (err as Error).message);
    // Exit process with failure
    process.exit(1);
  }
};

afterAll(() => {
  mongoose.disconnect();
});

export default connectDB;