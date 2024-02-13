import { Socket } from "socket.io";
import logger from "../logger";
import { EVENT_NAME } from "../constants";
import { signUp } from "../playing/signUp";
import { checkPossibility, leaveTable, move } from "../playing";

const handleEvent = (socket: Socket) => {
  socket.onAny((eventName: string, data) => {
    logger.info(
      `REQUEST EVENT NAME: ${eventName}, REQUEST DATA: ${JSON.stringify(
        data.data
      )} socket :: ${socket.id}`
    );

    switch (eventName) {
      case EVENT_NAME.SIGN_UP:
        signUp(data, socket);
        break;
      case EVENT_NAME.CHECK_POSSIBILITY:
        checkPossibility(data, socket);
        break;
      case EVENT_NAME.MOVE:
        move(data, socket);
        break;
      case EVENT_NAME.LEAVE:
        leaveTable(data.data, socket);
        break;
    }
  });
};

export default handleEvent;
