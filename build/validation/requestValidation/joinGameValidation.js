"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinGameValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
function joinGameValidation(data) {
    const signUpDataSchema = joi_1.default.object().keys({
        eventName: joi_1.default.string()
            .valid(constants_1.EVENT_NAME.JOIN_GAME, constants_1.EVENT_NAME.SIGN_UP)
            .required(),
        data: joi_1.default.object().keys({
            userName: joi_1.default.string().required(),
        }),
    });
    const { error, value } = signUpDataSchema.validate(data);
    if (error) {
        logger_1.default.error(`Request validation error in joinGameValidation ${error}`);
    }
    else {
        return value;
    }
}
exports.joinGameValidation = joinGameValidation;
