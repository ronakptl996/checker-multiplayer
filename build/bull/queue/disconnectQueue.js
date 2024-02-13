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
exports.disconnectQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../../logger"));
const constants_1 = require("../../constants");
const redisConnection_1 = require("../../connection/redisConnection");
const playing_1 = require("../../playing");
dotenv_1.default.config({ path: "../../../.env" });
function disconnectQueue(tableId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (tableId) {
                let disconnectDelayQueue = new bull_1.default(constants_1.BULL_KEY.DISCONNECT_DELAY_QUEUE, {
                    redis: redisConnection_1.redisOptions,
                });
                let options = {
                    delay: 2000,
                    attempts: 1,
                    job_id: tableId,
                };
                yield disconnectDelayQueue.add(tableId, options);
                yield disconnectDelayQueue.process((job) => __awaiter(this, void 0, void 0, function* () {
                    yield (0, playing_1.disconnect)(job.tableId);
                }));
            }
        }
        catch (error) {
            logger_1.default.error(`CATCH ERROR in disconnectQueue : ${error}`);
        }
    });
}
exports.disconnectQueue = disconnectQueue;
