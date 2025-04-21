const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/room.controller.js");

// Your room routes here
router.post("/", RoomController.createRoom);
router.post("/end", RoomController.endRoom);

router.post("/join", RoomController.joinRoom);
router.post("/leave", RoomController.leaveRoom);

router.get("/", RoomController.getAllRooms); // testing purpose

module.exports = router;
