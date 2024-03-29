import { REDIS_KEY } from "../constants";
import { ITable } from "../interface";
import logger from "../logger";
import { Del, Set, Get } from "../redisOperation";

const disconnect = async (tableId: string) => {
  try {
    let tableData: ITable = tableId
      ? await Get(`${REDIS_KEY.REDIS_TABLE}:${tableId}`)
      : null;

    if (tableData) {
      let QueueData: any = await Get(REDIS_KEY.REDIS_QUEUE);
      if (QueueData && QueueData.tablesId.includes(tableData._id)) {
        QueueData.tablesId.splice(QueueData.tablesId.indexOf(tableData._id), 1);
      }

      await Set(REDIS_KEY.REDIS_QUEUE, { tablesId: QueueData.tablesId });
      tableData.player[0]
        ? await Del(`${REDIS_KEY.USER}:${tableData.player[0]._id}`)
        : null;

      tableData.player[1]
        ? await Del(`${REDIS_KEY.USER}:${tableData.player[1]._id}`)
        : null;
      await Del(`${REDIS_KEY.REDIS_TABLE}:${tableData._id}`);
    }
  } catch (error) {
    logger.error(`CATCH ERROR in disconnect : ${error}`);
  }
};

export default disconnect;
