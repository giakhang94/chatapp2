import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
//deploy
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});
//socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatapp2-socketio.onrender.com",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`user ${socket.id} has join the room ${room}`);
  });
  socket.on("send_chat", (data) => {
    console.log(data);
    socket.to(data.room).emit("send_back_chat", data);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("server is on port 3001");
});
