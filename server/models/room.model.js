const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    roomId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Room name cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: true,
      enum: ["instant", "scheduled"],
      default: "instant",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    maxParticipants: {
      type: Number,
      default: 10,
      min: [2, "Room must allow at least 2 participant"],
      max: [50, "Room cannot exceed 50 participants"],
    },
    // Scheduled room specific fields
    scheduledAt: {
      type: Date,
      required: function () {
        return this.type === "scheduled";
      },
    },
    timeZone: {
      type: String,
      default: "UTC",
    },
    // Host information
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Room configuration
    configuration: {
      chatEnabled: {
        type: Boolean,
        default: true,
      },
    },
    // Permissions
    permissions: {
      codeEdit: {
        type: String,
        enum: ["all", "host", "selected"],
        default: "host",
      },
      allowedEditors: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    // Room participants
    participants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Room status
    status: {
      type: String,
      enum: ["active", "scheduled", "completed", "cancelled"],
      default: function () {
        return this.type === "instant" ? "active" : "scheduled";
      },
    },
    joinLink: {
      type: String,
      unique: true,
      sparse: true,
    },
    files: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "File",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster room lookups
roomSchema.index({ name: 1 });
roomSchema.index({ host: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ scheduledAt: 1 }, { sparse: true });

// Virtual for checking if room is active
roomSchema.virtual("isActive").get(function () {
  return this.status === "active";
});

// Add pre-save middleware to set default values based on room type
roomSchema.pre("save", function (next) {
  if (this.type === "instant") {
    this.scheduledAt = undefined;
  }
  next();
});

// Create the Room model
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
