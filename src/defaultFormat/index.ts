import { v4 as uuidV4 } from "uuid";

const setUser = (username: string, socketId: string) => {
  return {
    _id: uuidV4(),
    userName: username,
    socketId: socketId,
  };
};

const setTable = (userData: any, turnId: string) => {
  return {
    _id: uuidV4(),
    activePlayer: 1,
    maxPlayer: 2,
    board: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
    ],
    player: [userData],
    status: "waiting",
    playerScore: [0, 0],
    turnId: turnId,
  };
};

export { setUser, setTable };
