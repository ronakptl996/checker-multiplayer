"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resPossibilityValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
function resPossibilityValidation(data) {
    const schema = joi_1.default.object().keys({
        eventName: joi_1.default.string().valid(constants_1.EVENT_NAME.CHECK_POSSIBILITY).required(),
        data: {
            row: joi_1.default.array(),
            col: joi_1.default.array(),
            killRow: joi_1.default.array(),
            killCol: joi_1.default.array(),
            kill: joi_1.default.array(),
            userId: joi_1.default.string().required(),
        },
    });
    const { error, value } = schema.validate(data);
    if (error) {
        logger_1.default.error(`Response Validation Error in resPossibilityValidation: ${error}`);
    }
    else {
        return value;
    }
}
exports.resPossibilityValidation = resPossibilityValidation;
