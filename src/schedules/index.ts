import schedule from "node-schedule";
import pino from "pino";
import { Worker } from "worker_threads";

const logger = pino();

export const runSchedules = () => {
  const cron: string = process.env.CRON || "";
  const cronWorker: string = process.env.CRON_WORKER || "";

  if (cron) {
    // this schedule is for little job
    schedule.scheduleJob(cron, function () {
      const title = "[CRON 1]";
      logger.info(`${title} - ${new Date().toLocaleString()} - Started`);
      // insert your job here ...
      logger.info(`${title} - ${new Date().toLocaleString()} - Finished`);
    });
  }

  if (cronWorker) {
    schedule.scheduleJob(cronWorker, function () {
      const workerData = "[CRON 2]";
      logger.info(`${workerData} - ${new Date().toLocaleString()} - Started`);

      // this worker is for a long process - parallel worker
      new Worker("./src/schedules/schedule01.js", { workerData });
    });
  }
};
