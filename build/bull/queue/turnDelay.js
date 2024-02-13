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
const responseValidation_1 = require("../../validation/responseValidation");
const logger_1 = __importDefault(require("../../logger"));
const redisOperation_1 = require("../../redisOperation");
dotenv_1.default.config({ path: "../../../.env" });
const turnDelay = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let redisData = {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            db: process.env.REDIS_DB,
        };
        let turnDelayQueue = new bull_1.default(constants_1.BULL_KEY.TURN_DELAY_QUEUE, {
            redis: redisData,
        });
        let option = {
            delay: data.delayTime,
            attempts: data.attempts,
            job_id: data.jobId,
        };
        yield turnDelayQueue.add(data, option);
        yield turnDelayQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
            let tableData = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${job.data.jobId}`);
            let userTurnStartData = {
                eventName: constants_1.EVENT_NAME.USER_TURN_START,
                data: {
                    userId: tableData.turnId,
                },
            };
            let validateUserTurnStartData = yield (0, responseValidation_1.userTurnStartValidation)(userTurnStartData);
            eventEmitter_1.default.sendToRoom(job.data.jobId, validateUserTurnStartData);
        }));
    }
    catch (error) {
        logger_1.default.error(`CATCH ERROR IN turnDelay : ${error}`);
    }
});
exports.default = turnDelay;
