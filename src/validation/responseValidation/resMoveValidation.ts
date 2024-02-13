import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";
import { IMoveData } from "../../interface";

export function resMoveValidation(data: IMoveData) {
  const schema = Joi.object().keys({
    eventName: Joi.string().valid(EVENT_NAME.MOVE).required(),
    data: Joi.object().keys({
      board: Joi.array().required(),
      score: Joi.array().required(),
    }),
  });

  const { error, value } = schema.validate(data);
  if (error) {
    logger.error(`Response Validation Error in resMoveValidation : ${error}`);
  } else {
    return value;
  }
}
