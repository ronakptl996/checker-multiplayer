import Queue from "bull";
import dotenv from "dotenv";
import logger from "../../logger";
import { BULL_KEY } from "../../constants";
import { redisOptions } from "../../connection/redisConnection";
import { disconnect } from "../../playing";

dotenv.config({ path: "../../../.env" });

export async function disconnectQueue(tableId: string) {
  try {
    if (tableId) {
      let disconnectDelayQueue = new Queue(BULL_KEY.DISCONNECT_DELAY_QUEUE, {
        redis: redisOptions,
      });

      let options = {
        delay: 2000,
        attempts: 1,
        job_id: tableId,
      };

      await disconnectDelayQueue.add(tableId, options);
      await disconnectDelayQueue.process(async (job: any) => {
        await disconnect(job.tableId);
      });
    }
  } catch (error) {
    logger.error(`CATCH ERROR in disconnectQueue : ${error}`);
  }
}
