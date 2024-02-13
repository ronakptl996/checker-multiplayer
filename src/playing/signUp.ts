import { EVENT_NAME, REDIS_KEY } from "../constants";
import { ISignUp, ITable, IUser } from "../interface";
import { Get, Set } from "../redisOperation";
import Event from "../eventEmitter";
import joinGame from "./joinGame";
import logger from "../logger";

export async function signUp(data: ISignUp, socket: any) {
  if (data.data.userId && data.data.tableId) {
    let userData: IUser = await Get(`${REDIS_KEY.USER}:${data.data.userId}`);
    if (userData) {
      userData.socketId = socket.id ? socket.id : null;
      await Set(`${REDIS_KEY.USER}:${data.data.userId}`, userData);

      let tableData: ITable = await Get(
        `${REDIS_KEY.REDIS_TABLE}:${data.data.tableId}`
      );
      socket.join(tableData._id);
      socket.tableId = tableData._id;

      let signUpData = {
        eventName: EVENT_NAME.SIGN_UP,
        data: {
          userId: userData._id,
        },
      };
      Event.sendToSocket(socket.id, signUpData);

      let sendUserData = {
        eventName: EVENT_NAME.JOIN_GAME,
        data: {
          userData: tableData.player,
          tableId: tableData._id,
          board: tableData.board,
          score: [0, 0],
          status: "start",
        },
      };

      Event.sendToRoom(tableData._id, sendUserData);

      let userTurnStartData = {
        eventName: EVENT_NAME.USER_TURN_START,
        data: {
          userId: tableData.turnId,
        },
      };

      Event.sendToRoom(tableData._id, userTurnStartData);
    } else {
      logger.error("User not found!");
      let winData = {
        eventName: EVENT_NAME.WIN,
        data: {
          winnerId: "",
        },
      };
      Event.sendToSocket(socket.id, winData);
    }
  } else {
    joinGame(data, socket);
  }
}
