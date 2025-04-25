const express = require("express");
const router = express.Router();
const FileController = require("../controllers/file.controller.js");
const authenticate = require("../middlewares/authenticate.js");

router.post("/", authenticate, FileController.createFile);
router.put("/", authenticate, FileController.updateFile);
router.post("/delete", authenticate, FileController.deleteFile);

module.exports = router;
