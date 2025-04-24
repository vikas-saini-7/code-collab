const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/room.controller.js");
const authenticate = require("../middlewares/authenticate.js");

// host specific endpoints
router.post("/", authenticate, RoomController.createRoom);
router.post("/end", authenticate, RoomController.endRoom);

// participant specific endpoints
router.post("/join", authenticate, RoomController.joinRoom);
router.post("/leave", authenticate, RoomController.leaveRoom);

// profile specific endpoints
router.get("/active-rooms", authenticate, RoomController.getActiveRooms);
router.get("/scheduled-rooms", authenticate, RoomController.getScheduledRooms);
router.get("/previous-rooms", authenticate, RoomController.getPreviousRooms);

router.get("/:roomId", authenticate, RoomController.getRoom);

router.get("/", RoomController.getAllRooms); // testing purpose

module.exports = router;
