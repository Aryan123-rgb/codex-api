import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./lib/dbConnect";
const app = express();
config();
import { userRouter } from "./routes/userRoutes";
import { codeRouter } from "./routes/codeRoutes";
import bodyParser from "body-parser";
console.log(process.env.REACT_APP_BASE_URL);
app.use(
  cors({
    credentials: true,
    origin: process.env.REACT_APP_BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dbConnect();
app.use("/user", userRouter);
app.use("/code", codeRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + 4000);
});
