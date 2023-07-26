import express from "express";
import { getPackageJson } from "../util";

const router = express.Router();

// optional - used to browser response
router.get("/", (req, res) => {
  res
    .status(200)
    .send(
      `Welcome to a <b>api-base-node</b> - version: ${getPackageJson().version}`
    );
});

export default router;
