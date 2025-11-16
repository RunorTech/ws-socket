import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const eventString = ["claim:updated", "claim:created", "claim:deleted"];

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  eventString.map((events) => {
    socket.on(events, (data) => {
      console.log(`Received ${events}`, data);
      io.emit(events, data);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 3002, () => {
  console.log("WS server running on port", process.env.PORT || 3002);
});
