/*
 * api-base-node
 * Its a core of api for NodeJs
 *
 * Author: Luiz Leite (luiz_particular@yahoo.com.br)
 * Date: 25/07/2023
 */

import express from "express";
import { Request, Response } from "express";
import { loadEnvs, connectMongo, getPackageJson } from "./util";
import healthRoute from "./routes/health";

loadEnvs();
connectMongo();

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// endpoints
app.use("/actuator", healthRoute);

// optional - used to browser response
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .send(
      `Welcome to a <b>api-base-node</b> - version: ${getPackageJson().version}`
    );
});

app.listen(process.env.PORT, () =>
  console.log(
    `api-base-node - listening on port ${process.env.PORT} - version: ${
      getPackageJson().version
    }`
  )
);
