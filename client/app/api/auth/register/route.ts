import connectDB from "@/lib/connectDB";
import User from "@/models/userSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.password, salt);

    const newUser = new User({
      fullName: body.fullName,
      email: body.email,
      password: hash,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { message: "Server Error", error: err },
      { status: 500 }
    );
  }
}
