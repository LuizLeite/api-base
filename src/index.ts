import express from "express";
import { Request, Response } from "express";
import Person from "@/person";

const app = express();
// middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

const person = new Person();
const hw = `Hello world ${person.sayName()}`;
console.log(hw);

app.get("/", (req: Request, res: Response) => {
  res.status(201).json({ message: hw });
});

app.listen(3000, () => console.log("Listening on port 3000!"));
