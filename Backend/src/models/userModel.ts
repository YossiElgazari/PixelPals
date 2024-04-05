import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface to describe a user document
export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  profilePicture?: string;
  bio?: string;
  isValidPassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  passwordHash: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Password hash middleware
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Helper method for validating user's password
userSchema.methods.isValidPassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
