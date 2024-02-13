import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";
import { IJoinGame } from "../../interface";

export function joinGameValidation(data: IJoinGame) {
  const signUpDataSchema = Joi.object().keys({
    eventName: Joi.string()
      .valid(EVENT_NAME.JOIN_GAME, EVENT_NAME.SIGN_UP)
      .required(),
    data: Joi.object().keys({
      userName: Joi.string().required(),
    }),
  });

  const { error, value } = signUpDataSchema.validate(data);

  if (error) {
    logger.error(`Request validation error in joinGameValidation ${error}`);
  } else {
    return value;
  }
}
