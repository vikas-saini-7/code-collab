const express = require("express");
const router = express.Router();
const roomRoutes = require("./room.routes.js");
const fileRoutes = require("./file.routes.js");

router.get("/test", (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

router.use("/room", roomRoutes);
router.use("/file", fileRoutes);

module.exports = router;
