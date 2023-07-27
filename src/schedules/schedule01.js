// eslint-disable-next-line @typescript-eslint/no-var-requires
const pino = require("pino");
const logger = pino();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { workerData } = require("worker_threads");

// workerData is a param from called
const doTask = () => {
  // insert your job here ...
  logger.info(`${workerData} - ${new Date().toLocaleString()} - Finished`);
};

doTask();
