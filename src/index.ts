import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./lib/dbConnect";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
config();

// app.use("/compiler", compilerRouter);
// app.use("/user", userRouter);

dbConnect();
app.listen(4000, () => {
    console.log("Server is running on port " + 4000);
});