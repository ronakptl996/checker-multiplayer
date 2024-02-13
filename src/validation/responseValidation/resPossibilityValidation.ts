import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";
import { IPossibility } from "../../interface";

export function resPossibilityValidation(data: IPossibility) {
  const schema = Joi.object().keys({
    eventName: Joi.string().valid(EVENT_NAME.CHECK_POSSIBILITY).required(),
    data: {
      row: Joi.array(),
      col: Joi.array(),
      killRow: Joi.array(),
      killCol: Joi.array(),
      kill: Joi.array(),
      userId: Joi.string().required(),
    },
  });

  const { error, value } = schema.validate(data);
  if (error) {
    logger.error(
      `Response Validation Error in resPossibilityValidation: ${error}`
    );
  } else {
    return value;
  }
}
