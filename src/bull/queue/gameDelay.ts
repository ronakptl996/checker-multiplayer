import Queue from "bull";
import { BULL_KEY, EVENT_NAME } from "../../constants";
import dotenv from "dotenv";
import Event from "../../eventEmitter";
import turnDelay from "./turnDelay";
import logger from "../../logger";
import { IGameDelay } from "../../interface";
import { redisOptions } from "../../connection/redisConnection";
dotenv.config({ path: "../../../.env" });

const delayGame = async (data: IGameDelay) => {
  try {
    let gameDelayQueue = new Queue(BULL_KEY.GAME_DELAY_QUEUE, {
      redis: redisOptions,
    });
    let option = {
      attempts: data.attempts,
      delay: data.delayTime,
      job_id: data.jobId,
    };
    await gameDelayQueue.add(data, option);
    await gameDelayQueue.process(async (job: any) => {
      let gameStartData = {
        eventName: EVENT_NAME.START_GAME,
        data: {
          message: "start Game",
          userId: job.data.userId,
        },
      };

      Event.sendToRoom(job.data.jobId, gameStartData);
      let turnDelayData: IGameDelay = {
        userId: job.data.userId,
        delayTime: 2000,
        attempts: 1,
        jobId: job.data.jobId,
      };
      await turnDelay(turnDelayData);
    });
  } catch (error) {
    logger.error(`CATCH ERROR in delayGame : ${error}`);
  }
};
export default delayGame;
