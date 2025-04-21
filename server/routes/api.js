const express = require("express");
const router = express.Router();
const roomRoutes = require("./room.routes.js");

router.get("/test", (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

router.use("/room", roomRoutes);

module.exports = router;
