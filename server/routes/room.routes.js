const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/room.controller.js");

// host specific endpoints
router.post("/", RoomController.createRoom);
router.post("/end", RoomController.endRoom);

// participant specific endpoints
router.post("/join", RoomController.joinRoom);
router.post("/leave", RoomController.leaveRoom);

// profile specific endpoints
router.get("/active-rooms", RoomController.getActiveRooms);
router.get("/scheduled-rooms", RoomController.getScheduledRooms);
router.get("/previous-rooms", RoomController.getPreviousRooms);

router.get("/", RoomController.getAllRooms); // testing purpose

module.exports = router;
