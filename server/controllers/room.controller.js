const Room = require("../models/room.model.js");
const User = require("../models/user.model.js");

exports.createRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const host = userId;
    const {
      name,
      type,
      description,
      maxParticipants,
      scheduledAt,
      timeZone,
      // configuration,
      // permissions,
    } = req.body;

    // Validate required fields
    if (!name || !host || !type) {
      return res.status(400).json({
        success: false,
        message: "Room name and host are required",
      });
    }

    // Generate unique roomId for the join link
    const { nanoid } = await import("nanoid");
    const { customAlphabet } = await import("nanoid");

    const generateSegment = customAlphabet(
      "abcdefghijklmnopqrstuvwxyz0123456789",
      3
    );
    const roomId = `${generateSegment()}-${generateSegment()}-${generateSegment()}`;

    const joinLink = `${process.env.FRONTEND_URL}/join-room/${roomId}`;

    // Create room object with provided data
    const roomData = {
      roomId,
      name,
      type: type,
      description,
      maxParticipants,
      host,
      joinLink,
    };

    // Add scheduled room specific fields if type is scheduled
    if (type === "scheduled") {
      if (!scheduledAt) {
        return res.status(400).json({
          success: false,
          message: "Scheduled time is required for scheduled rooms",
        });
      }
      roomData.scheduledAt = new Date(scheduledAt);
      roomData.timeZone = timeZone || "UTC";
    }

    // Create new room
    const newRoom = await Room.create(roomData);

    // Add host as first participant
    newRoom.participants.push({
      user: host,
      joinedAt: Date.now(),
    });
    await newRoom.save();

    res.status(201).json({
      success: true,
      data: newRoom,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// endroom only host can end room
exports.endRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const userId = req.userId;

    // Validate required fields
    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    // Find the room by ID
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user is the host
    if (room.host.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the host can end the room",
      });
    }

    // Update room status to completed
    room.status = "completed";
    await room.save();

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error ending room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// from body
// configuration: {
//   chatEnabled: true;
// }
// maxParticipants: 10;
// permissions: {
//   codeEdit: "host";
// }

exports.updateSettings = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;
    // Validate required fields
    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }
    // Find the room by ID
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    // Check if user is the host
    if (room.host.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the host can update the room settings",
      });
    }
    // Update room settings
    const {
      configuration,
      maxParticipants,
      permissions,
      description,
      scheduledAt,
    } = req.body;
    if (configuration) {
      room.configuration = {
        ...room.configuration,
        ...configuration,
      };
    }
    if (maxParticipants) {
      room.maxParticipants = maxParticipants;
    }
    if (permissions) {
      room.permissions = {
        ...room.permissions,
        ...permissions,
      };
    }
    if (description) {
      room.description = description;
    }
    if (scheduledAt) {
      room.scheduledAt = new Date(scheduledAt);
    }
    await room.save();
    
    // Emit room settings update event
    const io = require('../server').io;
    io.to(roomId).emit("roomSettingsUpdate", {
      configuration: room.configuration,
      maxParticipants: room.maxParticipants,
      permissions: room.permissions,
      description: room.description,
      scheduledAt: room.scheduledAt
    });

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error updating room settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const userId = req.userId;

    // Validate required fields
    if (!roomId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Room ID and user ID are required",
      });
    }

    // Find the room by ID
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user is already a participant
    const isParticipant = room.participants.some(
      (participant) => participant.user.toString() === userId
    );
    if (isParticipant) {
      return res.status(400).json({
        success: false,
        message: "User is already a participant in this room",
      });
    }

    // Add user to participants list
    room.participants.push({
      user: userId,
      joinedAt: Date.now(),
    });
    await room.save();

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const userId = req.userId;

    // Validate required fields
    if (!roomId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Room ID and user ID are required",
      });
    }

    // Find the room by ID
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user is a participant
    const participantIndex = room.participants.findIndex(
      (participant) => participant.user.toString() === userId
    );
    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "User is not a participant in this room",
      });
    }

    // Remove user from participants list
    room.participants.splice(participantIndex, 1);
    await room.save();

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// get active rooms by host

exports.getActiveRooms = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find active rooms by host
    const activeRooms = await Room.find({
      host: userId,
      status: "active",
    });

    res.status(200).json({
      success: true,
      data: activeRooms,
    });
  } catch (error) {
    console.error("Error fetching active rooms:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getScheduledRooms = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find scheduled rooms by host
    const scheduledRooms = await Room.find({
      host: userId,
      status: "scheduled",
    });

    res.status(200).json({
      success: true,
      data: scheduledRooms,
    });
  } catch (error) {
    console.error("Error fetching scheduled rooms:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getPreviousRooms = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find completed rooms by host
    const previousRooms = await Room.find({
      host: userId,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      data: previousRooms,
    });
  } catch (error) {
    console.error("Error fetching previous rooms:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    // Validate required fields
    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    // Find the room by ID
    const room = await Room.findOne({ roomId })
      .populate({
        path: "participants.user",
        select: "fullName username email profileImage",
      })
      .populate("files");
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user is a participant or the host
    const isParticipant = room.participants.some(
      (participant) => participant.user._id.toString() === userId.toString()
    );
    const isHost = room.host._id.toString() === userId.toString();

    if (!isParticipant && !isHost) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You must be a participant or host of this room.",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});

    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
