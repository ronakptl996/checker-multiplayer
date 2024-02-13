import Joi from "joi";
import { IMove } from "../../interface";
import logger from "../../logger";
import { EVENT_NAME } from "../../constants";

export function moveValidation(data: IMove) {
  const moveSchema = Joi.object().keys({
    eventName: Joi.string().valid(EVENT_NAME.MOVE).required(),
    data: Joi.object().keys({
      id: Joi.string().required(),
      moveId: Joi.string().required(),
      color: Joi.number().required(),
      userId: Joi.string().required(),
      kill: Joi.array(),
    }),
  });

  const { error, value } = moveSchema.validate(data);
  if (error) {
    logger.error(`request validation in moveValidation : ${error}`);
  } else {
    return value;
  }
}
