const File = require("../models/file.model");
const Room = require("../models/room.model");
// roomId: {
//     type: Schema.Types.ObjectId,
//     ref: "Room",
//     required: true,
//   },
//   fileName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   language: {
//     type: String,
//     default: "javascript",
//   },
//   extension: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     default: "",
//   },
//   createdBy: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },
//   lastEditedBy: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },

exports.createFile = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId, fileName, language, extension, content } = req.body;

    // Validate input
    if (!roomId || !fileName || !extension) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if the file already exists
    const existingFile = await File.findOne({
      roomId,
      fileName,
    });
    if (existingFile) {
      return res.status(409).json({
        success: false,
        message: "File already exists",
      });
    }

    const newFile = new File({
      roomId,
      fileName,
      language,
      extension,
      content: content || "",
      createdBy: userId,
      lastEditedBy: userId,
    });

    await newFile.save();

    // also add this file to the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    room.files.push(newFile._id);
    await room.save();

    res.status(201).json({
      success: true,
      data: newFile,
    });
  } catch (error) {
    console.error("Error creating file:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fileId, fileName, language, extension, content } = req.body;

    // Validate input
    if (!fileId || !fileName || !extension) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if the file exists
    const existingFile = await File.findById(fileId);
    if (!existingFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Update the file
    existingFile.fileName = fileName;
    existingFile.language = language;
    existingFile.extension = extension;
    existingFile.content = content || "";
    existingFile.lastEditedBy = userId;

    await existingFile.save();

    res.status(200).json({
      success: true,
      data: existingFile,
    });
  } catch (error) {
    console.error("Error updating file:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { roomId, fileId } = req.body;

    // Validate input
    if (!roomId || !fileId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if the file exists
    const existingFile = await File.findById(fileId);
    if (!existingFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }
    // Check if the file belongs to the room
    if (existingFile.roomId.toString() !== roomId) {
      return res.status(403).json({
        success: false,
        message: "File does not belong to this room",
      });
    }
    // Remove the file from the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    room.files = room.files.filter((file) => file.toString() !== fileId);
    await room.save();

    // Delete the file
    await existingFile.deleteOne();

    console.log("yes");

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auto-save`, {
//         fileId: activeFile._id,
//         content: latestFileContent.current,
//         roomId: roomData?._id,
//       });

exports.autoSaveFile = async (req, res) => {
  try {
    const { fileId, content, roomId } = req.body;

    console.log(req.body);

    // Validate input
    if (!fileId || !content || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if the file exists
    const existingFile = await File.findById(fileId);
    if (!existingFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check if the file belongs to the room
    if (existingFile.roomId.toString() !== roomId) {
      return res.status(403).json({
        success: false,
        message: "File does not belong to this room",
      });
    }

    // Update the file content
    existingFile.content = content;
    existingFile.lastEditedBy = req.userId;

    await existingFile.save();

    res.status(200).json({
      success: true,
      data: existingFile,
    });
  } catch (error) {
    console.error("Error auto-saving file:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
