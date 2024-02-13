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
const logger_1 = __importDefault(require("../logger"));
const redisOperation_1 = require("../redisOperation");
const disconnect = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DISCONNECT TABLE ID :: >>---------------", tableId);
    try {
        let tableData = tableId
            ? yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableId}`)
            : null;
        console.log("DISCONNECT TABLE DATA :: >> ----------", tableData);
        if (tableData) {
            let QueueData = yield (0, redisOperation_1.Get)(constants_1.REDIS_KEY.REDIS_QUEUE);
            if (QueueData && QueueData.tablesId.includes(tableData._id)) {
                QueueData.tablesId.splice(QueueData.tablesId.indexOf(tableData._id), 1);
            }
            yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, { tablesId: QueueData.tablesId });
            tableData.player[0]
                ? yield (0, redisOperation_1.Del)(`${constants_1.REDIS_KEY.USER}:${tableData.player[0]._id}`)
                : null;
            tableData.player[1]
                ? yield (0, redisOperation_1.Del)(`${constants_1.REDIS_KEY.USER}:${tableData.player[1]._id}`)
                : null;
            yield (0, redisOperation_1.Del)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableData._id}`);
        }
    }
    catch (error) {
        logger_1.default.error(`CATCH ERROR in disconnect : ${error}`);
    }
});
exports.default = disconnect;
