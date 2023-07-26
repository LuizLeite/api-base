import dotenv, { DotenvConfigOutput } from "dotenv";
import User from "../models/User";
import pino from "pino";
import mongoose from "mongoose";
import { Pool, Client, QueryResult } from "pg";
import oracledb from "oracledb";

const logger = pino();

// load ENVs saved on file .env
export const loadEnvs = () => {
  const myEnvs: DotenvConfigOutput = dotenv.config();

  if (myEnvs && myEnvs?.parsed)
    Object.entries(myEnvs.parsed).forEach((el) => (process.env[el[0]] = el[1]));
};

export async function connectMongo() {
  await mongoose.connect(`${process.env.MONGO_URL || ""}`);
}

export async function checkMongo(checkMongo = false): Promise<string> {
  let resp = "";

  if (checkMongo) {
    try {
      const doc = await User.findOne().lean();
      if (doc) {
        resp = "MongoDB is OK";
      } else {
        resp = "MongoDB is ok, but users is empty";
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      resp = `Error: ${error.message}`;
      logger.error(resp);
      return resp;
    }
  } else {
    resp = "MongoDB not checked";
  }
  logger.info(resp);
  return resp;
}

export async function checkPostgre(checkPostgres = false): Promise<string> {
  let resp = "";

  if (checkPostgres) {
    try {
      const pool = new Pool();
      const respPool: QueryResult = await pool.query("SELECT NOW()");
      await pool.end();

      const client = new Client();
      await client.connect();
      const respClient = await client.query("SELECT NOW()");

      if (respPool.rowCount > 0 && respClient.rowCount > 0) {
        resp = "Poll and Client running OK";
      } else if (respPool.rowCount > 0 && respClient.rowCount === 0) {
        resp = "Poll running OK and Client not";
      } else if (respPool.rowCount === 0 && respClient.rowCount > 0) {
        resp = "Poll not and Client running OK";
      } else {
        resp = "Poll and Client not running";
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      resp = `Error: ${error.message}`;
      logger.error(resp);
      return resp;
    }
  } else {
    resp = "Postgres not checked";
  }

  logger.info(resp);
  return resp;
}

export async function checkOracle(checkOracle = false): Promise<string> {
  let resp = "";
  let conn = null;

  if (checkOracle) {
    loadEnvs();
    try {
      const options = {
        user: process.env.AERO_USER,
        password: process.env.AERO_PASS,
        connectString: process.env.AERO_HOST,
      };
      if (!process.env.LD_LIBRARY_PATH) {
        const err =
          "Cannot find LD_LIBRARY_PATH. run export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_11";
        logger.error(err);
        return err;
      }
      await oracledb.initOracleClient();
      conn = await oracledb.getConnection(options);
      const result = await conn.execute("SELECT CURRENT_DATE FROM DUAL");
      resp = "Oracle running but cant get hour";
      if (result?.rows?.length) resp = "Oracle running OK";

      // const result2 = await conn.execute(
      //   "select VEHICLE_ID from AERO.VEHICLES WHERE VEHICLE_ID = 571809",
      //   [],
      //   { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
      // );
      // const rs = await result2.resultSet;
      // if (rs) {
      //   let row: any = null;
      //   while ((row = await rs.getRow())) {
      //     if (row.DONE) console.log(row.DESCRIPTION, "is done");
      //     else console.log(row.DESCRIPTION, "is NOT done");
      //   }
      //   await rs.close();
      // }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      resp = `Error: ${error.message}`;
      logger.error(resp);
      return resp;
    }
  } else {
    resp = "Oracle not checked";
  }

  logger.info(resp);
  return resp;
}

export const getPackageJson = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../../package.json");
};
