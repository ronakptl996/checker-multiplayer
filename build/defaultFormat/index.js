"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTable = exports.setUser = void 0;
const uuid_1 = require("uuid");
const setUser = (username, socketId) => {
    return {
        _id: (0, uuid_1.v4)(),
        userName: username,
        socketId: socketId,
    };
};
exports.setUser = setUser;
const setTable = (userData, turnId) => {
    return {
        _id: (0, uuid_1.v4)(),
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
exports.setTable = setTable;
