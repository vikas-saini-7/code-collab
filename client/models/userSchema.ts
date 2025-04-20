import mongoose from "mongoose";

interface IUser {
  fullName: string;
  username?: string;
  email: string;
  password: string;
  role?: {
    type:
      | "Frontend Dev"
      | "Backend Dev"
      | "Full Stack"
      | "DevOps"
      | "Student"
      | "Other";
    custom?: string;
  };
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
      type: {
        type: String,
        enum: [
          "Frontend Dev",
          "Backend Dev",
          "Full Stack",
          "DevOps",
          "Student",
          "Other",
        ],
      },
      custom: {
        type: String,
        required: function (this: IUser) {
          return this.role?.type === "Other";
        },
      },
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
