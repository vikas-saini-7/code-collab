// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]/auth";
// import { NextResponse } from "next/server";
// import connectDB from "../../../lib/connectDB";
// import User from "@/models/userSchema";

// export async function GET() {
//   try {
//     // Get session from next-auth
//     const session = await getServerSession(authOptions);

//     console.log(session);

//     if (!session) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     // Connect to database
//     await connectDB();

//     // Find user by id from session
//     const user = await User.findById(session.user.id).select("-password");

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: "User found",
//       data: user,
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import { NextResponse } from "next/server";
import connectDB from "../../../lib/connectDB";
import User from "@/models/userSchema";
import jwt from "jsonwebtoken"; // Add this import

export async function GET() {
  try {
    // Get session from next-auth
    const session = await getServerSession(authOptions);

    console.log(session);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Find user by id from session
    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sign JWT token with user's _id
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "7d" }
    );

    // Create response
    const response = NextResponse.json({
      message: "User found",
      data: user,
    });

    // Attach token as an HTTP-only cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
