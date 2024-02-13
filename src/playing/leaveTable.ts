import logger from "../logger";
import { Get } from "../redisOperation";
import { disconnect } from "./";
import Event from "../eventEmitter";
import { EVENT_NAME, REDIS_KEY } from "../constants";

export async function leaveTable(data: { userId: string }, socket: any) {
  try {
    let tableData = await Get(`${REDIS_KEY.REDIS_TABLE}:${socket.tableId}`);

    if (tableData) {
      let winData = {
        eventName: EVENT_NAME.WIN,
        data: {
          winnerId:
            tableData.player[0]._id == data.userId
              ? tableData.player[1]._id
              : tableData.player[0]._id,
        },
      };

      Event.sendToRoom(tableData._id, winData);
      disconnect(socket.tableId);
    }
  } catch (error) {
    logger.error(`Catch Error in LeaveTable: ${error}`);
  }
}
