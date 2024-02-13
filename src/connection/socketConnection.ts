import { createAdapter } from "socket.io-redis";
import { io } from "..";
import { redisPub, redisSub } from "./redisConnection";
import handleEvent from "../eventHandler";
import Event from "../eventEmitter";
import { leaveTable } from "../playing";

const socketIoConnection = () => {
  io.adapter(createAdapter(redisPub, redisSub));
  io.on("connection", async (socket: any) => {
    handleEvent(socket);
    socket.on("disconnect", async () => {
      let leaveData = {
        eventName: "LEAVE_USER",
        data: { userId: socket.userId },
      };
      Event.sendToRoom(socket.tableId, leaveData);
      leaveTable(leaveData.data, socket);
    });
  });
};

export default socketIoConnection;
