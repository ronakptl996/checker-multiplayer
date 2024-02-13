"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const constants_1 = require("../constants");
const signUp_1 = require("../playing/signUp");
const playing_1 = require("../playing");
const handleEvent = (socket) => {
    socket.onAny((eventName, data) => {
        logger_1.default.info(`REQUEST EVENT NAME: ${eventName}, REQUEST DATA: ${JSON.stringify(data.data)}`);
        switch (eventName) {
            case constants_1.EVENT_NAME.SIGN_UP:
                (0, signUp_1.signUp)(data, socket);
                break;
            case constants_1.EVENT_NAME.CHECK_POSSIBILITY:
                (0, playing_1.checkPossibility)(data, socket);
                break;
            case constants_1.EVENT_NAME.MOVE:
                (0, playing_1.move)(data, socket);
                break;
            case constants_1.EVENT_NAME.LEAVE:
                (0, playing_1.leaveTable)(data.data, socket);
                break;
        }
    });
};
exports.default = handleEvent;
