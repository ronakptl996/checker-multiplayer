"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisOptions = exports.redisSub = exports.redisPub = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../logger"));
dotenv_1.default.config({ path: "../../.env" });
let redisOptions = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    db: process.env.REDIS_DB,
};
exports.redisOptions = redisOptions;
let redis = new ioredis_1.default(redisOptions);
exports.redis = redis;
redis.on("connect", () => {
    logger_1.default.info(`Redis connected successfully`);
    redis.flushdb();
});
let redisPub = new ioredis_1.default(redisOptions);
exports.redisPub = redisPub;
let redisSub = new ioredis_1.default(redisOptions);
exports.redisSub = redisSub;
redisPub.on("connect", () => {
    logger_1.default.info("redisPub connected successfully ");
});
redisSub.on("connect", () => {
    logger_1.default.info("redisSub connected successfully ");
});
redisPub.on("error", (error) => {
    logger_1.default.error("redisPub connection error : ", error);
});
redisSub.on("error", (error) => {
    logger_1.default.error("redisPub connection error : ", error);
});
