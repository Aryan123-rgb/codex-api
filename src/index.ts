import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./lib/dbConnect";
import { exec } from 'child_process';
import fs from 'fs'
const app = express();
config();
import { userRouter } from "./routes/userRoutes";
import { codeRouter } from "./routes/codeRoutes";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.REACT_APP_BASE_URL }));


app.use("/user", userRouter);
app.use('/code', codeRouter)

dbConnect();
app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + 4000);
});