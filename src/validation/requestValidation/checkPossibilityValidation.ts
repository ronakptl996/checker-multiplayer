import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";
import { IPossibility } from "../../interface";

export function checkPossibilityValidation(data: IPossibility) {
  const possibilitySchema = Joi.object().keys({
    eventName: Joi.string().valid(EVENT_NAME.CHECK_POSSIBILITY).required(),
    data: Joi.object().keys({
      index: Joi.number().required(),
      userId: Joi.string().required(),
      color: Joi.number().required(),
    }),
  });

  const { error, value } = possibilitySchema.validate(data);
  if (error) {
    logger.error(`Request Validation Error in checkPossibility: ${error}`);
  } else {
    return value;
  }
}
