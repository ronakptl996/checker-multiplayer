"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resMoveValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
function resMoveValidation(data) {
    const schema = joi_1.default.object().keys({
        eventName: joi_1.default.string().valid(constants_1.EVENT_NAME.MOVE).required(),
        data: joi_1.default.object().keys({
            board: joi_1.default.array().required(),
            score: joi_1.default.array().required(),
        }),
    });
    const { error, value } = schema.validate(data);
    if (error) {
        logger_1.default.error(`Response Validation Error in resMoveValidation : ${error}`);
    }
    else {
        return value;
    }
}
exports.resMoveValidation = resMoveValidation;
