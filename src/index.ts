/*
 * api-base-node
 * Its a core of api for NodeJs
 *
 * Author: Luiz Leite (luiz_particular@yahoo.com.br)
 * Date: 25/07/2023
 */

import express from "express";
import { Request, Response } from "express";
import { loadEnvs } from "./util";
import healthRoute from "./routes/health";
import mongoose from "mongoose";

loadEnvs();
mongoose.connect(`${process.env.MONGO_URL || ""}`);

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// endpoints
app.use("/actuator", healthRoute);

// optional - used to browser response
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to a api-base-node" });
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}!`)
);
