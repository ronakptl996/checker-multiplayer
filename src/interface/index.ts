export interface IUser {
  _id: any;
  userName: string;
  socketId: string;
}

export interface ITable {
  _id: any;
  activePlayer: number;
  maxPlayer: number;
  board: number[][];
  player: IUser[];
  status: string;
  playerScore: number[];
  turnId: string;
}

export interface IPossibility {
  eventName: string;
  data: {
    index?: number;
    userId?: string;
    color?: number;
    row?: number[] | null;
    col?: number[] | null;
    killRow?: number[] | null;
    killCol?: number[] | null;
    kill?: number[] | null;
  };
}

export interface IMove {
  eventName: string;
  data: {
    id: string;
    moveId: string;
    color: number;
    userId: string;
    kill: number[];
  };
}

export interface IMoveData {
  eventName: string;
  data: {
    board: number[][];
    score: number[];
  };
}

export interface IWinData {
  eventName: string;
  data: {
    winnerId: string;
  };
}

export interface IGameDelay {
  jobId: string;
  attempts: number;
  delayTime: number;
  userId: string;
}

export interface ISignUp {
  eventName: string;
  data: {
    userId: string | null;
    tableId: string | null;
    userName: string | null;
  };
}

export interface IJoinGame {
  eventName: string;
  data: {
    userName: string;
  };
}

export interface IUserTurnStart {
  eventName: string;
  data: {
    userId: string;
  };
}
