const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    extension: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
