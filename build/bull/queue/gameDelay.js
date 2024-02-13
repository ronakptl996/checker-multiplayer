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
const bull_1 = __importDefault(require("bull"));
const constants_1 = require("../../constants");
const dotenv_1 = __importDefault(require("dotenv"));
const eventEmitter_1 = __importDefault(require("../../eventEmitter"));
const turnDelay_1 = __importDefault(require("./turnDelay"));
const logger_1 = __importDefault(require("../../logger"));
const redisConnection_1 = require("../../connection/redisConnection");
dotenv_1.default.config({ path: "../../../.env" });
const delayGame = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let gameDelayQueue = new bull_1.default(constants_1.BULL_KEY.GAME_DELAY_QUEUE, {
            redis: redisConnection_1.redisOptions,
        });
        let option = {
            attempts: data.attempts,
            delay: data.delayTime,
            job_id: data.jobId,
        };
        yield gameDelayQueue.add(data, option);
        yield gameDelayQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
            let gameStartData = {
                eventName: constants_1.EVENT_NAME.START_GAME,
                data: {
                    message: "start Game",
                    userId: job.data.userId,
                },
            };
            eventEmitter_1.default.sendToRoom(job.data.jobId, gameStartData);
            let turnDelayData = {
                userId: job.data.userId,
                delayTime: 2000,
                attempts: 1,
                jobId: job.data.jobId,
            };
            yield (0, turnDelay_1.default)(turnDelayData);
        }));
    }
    catch (error) {
        logger_1.default.error(`CATCH ERROR in delayGame : ${error}`);
    }
});
exports.default = delayGame;
