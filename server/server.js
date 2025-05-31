require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const apiRoutes = require("./routes/api.js");
const server = http.createServer(app);
const connectDB = require("./utils/connectDB.js");
const initializeSocket = require("./web-socket");

// Enable CORS for required origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://realtime-code-collab.vercel.app",
      "*",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// this be used for frontend requests
app.use("/api", apiRoutes);

// Initialize Socket.IO
initializeSocket(server);

const port = process.env.PORT || 9000;
connectDB();
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});