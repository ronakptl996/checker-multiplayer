"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPossibilityValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
function checkPossibilityValidation(data) {
    const possibilitySchema = joi_1.default.object().keys({
        eventName: joi_1.default.string().valid(constants_1.EVENT_NAME.CHECK_POSSIBILITY).required(),
        data: joi_1.default.object().keys({
            index: joi_1.default.number().required(),
            userId: joi_1.default.string().required(),
            color: joi_1.default.number().required(),
        }),
    });
    const { error, value } = possibilitySchema.validate(data);
    if (error) {
        logger_1.default.error(`Request Validation Error in checkPossibility: ${error}`);
    }
    else {
        return value;
    }
}
exports.checkPossibilityValidation = checkPossibilityValidation;
