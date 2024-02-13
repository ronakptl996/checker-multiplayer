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
const defaultFormat_1 = require("../defaultFormat");
const requestValidation_1 = require("../validation/requestValidation");
const responseValidation_1 = require("../validation/responseValidation");
const gameDelay_1 = __importDefault(require("../bull/queue/gameDelay"));
const gameDelayTime = 5;
const joinGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        data = yield (0, requestValidation_1.joinGameValidation)(data);
        if (data) {
            let userData = (0, defaultFormat_1.setUser)(data.data.userName, socket.id);
            let addUser = yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.USER}:${userData._id}`, userData);
            if (addUser) {
                let signUpData = {
                    eventName: constants_1.EVENT_NAME.SIGN_UP,
                    data: {
                        userId: userData._id,
                    },
                };
                eventEmitter_1.default.sendToSocket(userData.socketId, signUpData);
                let QueueData = yield (0, redisOperation_1.Get)(constants_1.REDIS_KEY.REDIS_QUEUE);
                let tableData;
                if (QueueData && QueueData.tablesId.length > 0) {
                    tableData = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${QueueData.tablesId[0]}`);
                    tableData.activePlayer += 1;
                }
                if (tableData && tableData.activePlayer == tableData.maxPlayer) {
                    socket.tableId = tableData._id;
                    socket.user2Id = userData._id;
                    tableData.player.push(userData);
                    tableData.status = "start";
                    yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableData._id}`, tableData);
                    QueueData.tablesId.shift();
                    yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, { tablesId: QueueData.tablesId });
                    socket.join(tableData._id);
                    let sendUserData = {
                        eventName: constants_1.EVENT_NAME.JOIN_GAME,
                        data: {
                            userData: tableData.player,
                            tableId: tableData._id,
                            board: tableData.board,
                            score: [0, 0],
                            status: tableData.status,
                        },
                    };
                    let validateUserData = yield (0, responseValidation_1.resJoinGameValidation)(sendUserData);
                    eventEmitter_1.default.sendToRoom(tableData._id, validateUserData);
                    let roundTimerStartData = {
                        eventName: constants_1.EVENT_NAME.ROUND_TIMER_START,
                        data: {
                            delayTime: gameDelayTime,
                        },
                    };
                    let validateRoundTimerData = yield (0, responseValidation_1.roundTimerValidation)(roundTimerStartData);
                    eventEmitter_1.default.sendToRoom(tableData._id, validateRoundTimerData);
                    let delayGameData = {
                        jobId: tableData._id,
                        attempts: 1,
                        delayTime: gameDelayTime * 1000,
                        userId: tableData.player[0]._id,
                    };
                    (0, gameDelay_1.default)(delayGameData);
                }
                else {
                    let tableData = (0, defaultFormat_1.setTable)(userData, userData._id);
                    yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, { tablesId: [tableData._id] });
                    yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableData._id}`, tableData);
                    socket.join(tableData._id);
                    socket.tableId = tableData._id;
                    socket.user1Id = userData._id;
                    let sendUserData = {
                        eventName: constants_1.EVENT_NAME.JOIN_GAME,
                        data: {
                            userData: [userData],
                            score: [0, 0],
                            tableId: tableData._id,
                            board: tableData.board,
                            status: tableData.status,
                        },
                    };
                    let validateUserData = yield (0, responseValidation_1.resJoinGameValidation)(sendUserData);
                    eventEmitter_1.default.sendToRoom(tableData._id, validateUserData);
                }
            }
        }
    }
    catch (error) {
        logger_1.default.error(`CATCH ERROR in joinGame : ${error}`);
    }
});
exports.default = joinGame;
