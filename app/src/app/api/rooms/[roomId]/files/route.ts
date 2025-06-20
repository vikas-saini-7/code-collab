import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Room from "@/models/room";
import File from "@/models/file";

type Params = Promise<{ roomId: string }>;

export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    // Get session from next-auth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    const params = await segmentData.params;
    const roomId = params.roomId;

    // find room
    const room = await Room.findOne({ roomId: roomId });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const files = await File.find({ roomId: room._id });

    return NextResponse.json(files, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch files:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const params = await segmentData.params;
    const roomId = params.roomId;

    const { name, language } = await request.json();
    console.log("Creating file with data:", { name, language });
    if (!name || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Check if the room exists
    const room = await Room.findOne({ roomId: roomId });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const content = "";
    // Create the new file
    console.log("language:", language);
    const newFile = await File.create({
      name,
      content,
      language,
      roomId: room._id,
      createdBy: session.user.id,
    });

    // Add the file to the room's files array
    room.files.push(newFile._id);
    await room.save();

    return NextResponse.json(newFile, { status: 201 });
  } catch (err) {
    console.error("Failed to create file:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
