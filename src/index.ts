/*
 * api-base-node
 * Its a core of api for NodeJs
 *
 * Author: Luiz Leite (luiz_particular@yahoo.com.br)
 * Date: 25/07/2023
 */

import express from "express";
import { loadEnvs, connectMongo, getPackageJson } from "./util";
import rootRoute from "./routes/_root";
import healthRoute from "./routes/health";
import { runSchedules } from "./schedules";

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// endpoints
app.use("/", rootRoute);
app.use("/actuator", healthRoute);

loadEnvs();
connectMongo();
runSchedules();

app.listen(process.env.PORT, () =>
  console.log(
    `api-base-node - listening on port ${process.env.PORT} - version: ${
      getPackageJson().version
    }`
  )
);
