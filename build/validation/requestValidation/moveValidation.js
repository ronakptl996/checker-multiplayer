"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../../logger"));
const constants_1 = require("../../constants");
function moveValidation(data) {
    const moveSchema = joi_1.default.object().keys({
        eventName: joi_1.default.string().valid(constants_1.EVENT_NAME.MOVE).required(),
        data: joi_1.default.object().keys({
            id: joi_1.default.string().required(),
            moveId: joi_1.default.string().required(),
            color: joi_1.default.number().required(),
            userId: joi_1.default.string().required(),
            kill: joi_1.default.array(),
        }),
    });
    const { error, value } = moveSchema.validate(data);
    if (error) {
        logger_1.default.error(`request validation in moveValidation : ${error}`);
    }
    else {
        return value;
    }
}
exports.moveValidation = moveValidation;
