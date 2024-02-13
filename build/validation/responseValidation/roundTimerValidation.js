"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundTimerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../../logger"));
function roundTimerValidation(data) {
    const schema = joi_1.default.object().keys({
        eventName: joi_1.default.string().required(),
        data: {
            delayTime: joi_1.default.number().required(),
        },
    });
    const { error, value } = schema.validate(data);
    if (error) {
        logger_1.default.error(`response validation error in roundTimerValidation : ${error}`);
    }
    else {
        return value;
    }
}
exports.roundTimerValidation = roundTimerValidation;
