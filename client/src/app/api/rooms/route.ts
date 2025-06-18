import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Room from "@/models/room";

export async function GET(req: NextRequest) {
  try {
    // Get session from next-auth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Find all rooms created by the logged-in user
    const rooms = await Room.find({ 
      createdBy: session.user.id 
    }).sort({ createdAt: -1 }); // Sort by newest first
    
    // Return the rooms
    return NextResponse.json(rooms, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch rooms:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const name = `${session.user.name}'s Room`

    const newRoom = await Room.create({
      name,
      createdBy: session.user.id,
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (err) {
    console.error("Failed to create room:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}