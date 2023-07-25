import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

setInterval(() => {
  const myEnv = dotenv.config();
  process.env.PORT = String(myEnv?.parsed?.PORT);
  console.log("PORT:", process.env.PORT);
}, 5000);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
});

app.listen(3000, () => console.log(`Listening on port ${process.env.PORT}!`));
