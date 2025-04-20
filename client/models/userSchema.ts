import mongoose from "mongoose";

interface IUser {
  fullName: string;
  username?: string;
  email: string;
  password: string;
  role?: string;
  experienceLevel?: "Beginner" | "Intermediate" | "Advanced";
  bio?: string;
  profilePicture?: string;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "",
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    bio: {
      type: String,
      maxLength: 200,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
