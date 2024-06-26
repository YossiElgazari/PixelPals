import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  profilePicture?: string;
  bio?: string;
  tokens: string[];
  isValidPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Please provide a valid email.',
      },
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    tokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model<IUser>("User", userSchema, "User");

export default User;
