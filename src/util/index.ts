import dotenv, { DotenvConfigOutput } from "dotenv";
import User from "../models/User";
import { Pool, Client, QueryResult } from "pg";
import pino from "pino";
import oracledb from "oracledb";

const logger = pino();

// load ENVs saved on file .env
export const loadEnvs = () => {
  const myEnvs: DotenvConfigOutput = dotenv.config();

  if (myEnvs && myEnvs?.parsed)
    Object.entries(myEnvs.parsed).forEach((el) => (process.env[el[0]] = el[1]));
};

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
        connectionString: process.env.AERO_HOST,
        mode: oracledb.SYSDBA,
      };

      console.log("AERO_HOST:", process.env.AERO_HOST);
      console.log("AERO_USER:", process.env.AERO_USER);
      console.log("AERO_PASS:", process.env.AERO_PASS);
      await oracledb.initOracleClient();
      conn = await oracledb.getConnection(options);
      console.log("passei 2");
      await conn.execute(
        "select VEHICLE_ID from VEHICLES WHERE VEHICLE_ID = 571809"
      );
      console.log("passei 3");
      const result = await conn.execute(
        `select description, done from todoitem`,
        [],
        { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      console.log("passei 4");
      const rs = result.resultSet;
      console.log("passei 5");
      if (rs) {
        let row: any = null;
        while ((row = await rs.getRow())) {
          if (row.DONE) console.log(row.DESCRIPTION, "is done");
          else console.log(row.DESCRIPTION, "is NOT done");
        }
        await rs.close();
      }
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
