import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import File from "@/models/file";

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    // Get session from next-auth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    const file = await File.findById(params.fileId);

    return NextResponse.json(file, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch file:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Check if the file exists
    const file = await File.findById(params.fileId);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Update the file content
    file.content = content;
    const newFile = await file.save();

    // Return the updated file
    if (!newFile) {
      return NextResponse.json(
        { error: "Failed to update file ka content" },
        { status: 500 }
      );
    }

    return NextResponse.json(newFile, { status: 200 });
  } catch (err) {
    console.error("Failed to update file content:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


// delete file 
export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    // Check if the file exists
    const file = await File.findById(params.fileId);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    // Delete the file
    const deletedFile = await File.findByIdAndDelete(params.fileId);
    if (!deletedFile) {
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Failed to delete file:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}