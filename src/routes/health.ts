import express from "express";
import os from "os";
import process from "process";
import pino from "pino";
import { checkMongo, checkPostgres, checkOracle } from "../util";

const logger = pino();
const router = express.Router();

router.get("/health", async (req, res) => {
  logger.info("health");
  const message = "It's running...";
  const ts = Date.now();
  const utcDate = new Date().toUTCString();
  const memTotal = os.totalmem() / 1024;
  const memFree = os.freemem() / 1024;
  const percentFree = Math.round((memFree / memTotal) * 100) + "%";
  const cpuUsage = process.cpuUsage();
  // const memUsage = process.memoryUsage();
  // const cpus = os.cpus();
  const resp = {
    mongoDB: "",
    postgreSQL: "",
    oracle: "",
    message,
    utcDate,
    ts,
    memTotal,
    memFree,
    percentFree,
    cpuUsage,
    // memUsage,
    // cpus,
  };

  resp.mongoDB = await checkMongo(true);
  resp.postgreSQL = await checkPostgres(true);
  resp.oracle = await checkOracle(true);

  res.status(200).json(resp);
});

export default router;
