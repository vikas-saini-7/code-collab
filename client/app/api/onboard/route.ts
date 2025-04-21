import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/userSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username, role, experienceLevel, bio, profilePicture, isPublic } =
      body;
    const email = session.user.email;

    // Validate required fields
    if (
      !role ||
      !username ||
      !experienceLevel ||
      !bio ||
      //   !profilePicture ||
      typeof isPublic !== "boolean"
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create/update user with all fields
    const user = await User.findOneAndUpdate(
      { email },
      {
        username,
        role,
        experienceLevel,
        bio,
        profilePicture,
        isOnboarded: true,
        isPublic,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ONBOARDING ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
