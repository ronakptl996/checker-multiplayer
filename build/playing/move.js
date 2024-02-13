"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const redisOperation_1 = require("../redisOperation");
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
const logger_1 = __importDefault(require("../logger"));
const _1 = require("./");
const responseValidation_1 = require("../validation/responseValidation");
const requestValidation_1 = require("../validation/requestValidation");
const move = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        data = yield (0, requestValidation_1.moveValidation)(data);
        if (data) {
            let tableData = socket.tableId
                ? yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${socket.tableId}`)
                : null;
            if (tableData) {
                let board = tableData.board;
                let oldIndex = parseInt(data.data.id.slice(1));
                let newIndex = parseInt(data.data.moveId.slice(1));
                let oldRow = oldIndex % 8 == 0
                    ? Math.floor(oldIndex / 8) - 1
                    : Math.floor(oldIndex / 8);
                let oldCol = oldIndex - oldRow * 8 - 1;
                let newRow = newIndex % 8 == 0
                    ? Math.floor(newIndex / 8) - 1
                    : Math.floor(newIndex / 8);
                let newCol = newIndex - newRow * 8 - 1;
                let color = data.data.color;
                if (!board[newRow][newCol]) {
                    board[oldRow][oldCol] = 0;
                    board[newRow][newCol] = color;
                    if (newRow == 0 || newRow == 7) {
                        board[newRow][newCol] = color == 2 || color == 5 ? 5 : 8;
                    }
                    if (data.data.kill) {
                        board[data.data.kill[0]][data.data.kill[1]] = 0;
                        if (color == 1 || color == 8) {
                            tableData.playerScore[0] = tableData.playerScore[0] + 1;
                        }
                        else {
                            tableData.playerScore[1] = tableData.playerScore[1] + 1;
                        }
                    }
                    tableData.board = board;
                    yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableData._id}`, tableData);
                    let moveData = {
                        eventName: constants_1.EVENT_NAME.MOVE,
                        data: {
                            board: board,
                            score: tableData.playerScore,
                        },
                    };
                    let validateMoveData = yield (0, responseValidation_1.resMoveValidation)(moveData);
                    eventEmitter_1.default.sendToRoom(socket.tableId, validateMoveData);
                    if (tableData.playerScore[0] == 12 ||
                        tableData.playerScore[1] == 12) {
                        let winData = {
                            eventName: constants_1.EVENT_NAME.WIN,
                            data: {
                                winnerId: null,
                            },
                        };
                        if (tableData.playerScore[0] == 12) {
                            winData.data.winnerId = tableData.player[0]._id;
                        }
                        else if (tableData.playerScore[1] == 12) {
                            winData.data.winnerId = tableData.player[1]._id;
                        }
                        let validateWinData = yield (0, responseValidation_1.winValidation)(winData);
                        eventEmitter_1.default.sendToRoom(socket.tableId, validateWinData);
                        (0, _1.disconnect)(socket);
                    }
                    let turnId = tableData.turnId == tableData.player[0]._id
                        ? tableData.player[1]._id
                        : tableData.player[0]._id;
                    tableData.turnId = turnId;
                    yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableData._id}`, tableData);
                    let userTurnStartData = {
                        eventName: constants_1.EVENT_NAME.USER_TURN_START,
                        data: {
                            userId: turnId,
                        },
                    };
                    let validateUserTurnData = yield (0, responseValidation_1.userTurnStartValidation)(userTurnStartData);
                    eventEmitter_1.default.sendToRoom(tableData._id, validateUserTurnData);
                }
            }
        }
    }
    catch (error) {
        logger_1.default.error(`Catch Error in Move: ${error}`);
    }
});
exports.default = move;
