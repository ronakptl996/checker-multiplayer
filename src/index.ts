import http from "http";
import express from "express";
import { Server } from "socket.io";
import logger from "./logger";
import path from "path";
import dotenv from "dotenv";
import socketIoConnection from "./connection/socketConnection";
dotenv.config({ path: "./.env" });

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
  pingInterval: 2000,
  pingTimeout: 2500,
});

socketIoConnection();

app.use(express.static(path.join(__dirname, "../view")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/game.html"));
});

const PORT = process.env.SERVER_PORT;

httpServer.listen(PORT, () => {
  logger.info(`Server running on PORT ${PORT}`);
});

export { io };
