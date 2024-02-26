import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./lib/dbConnect";
import { exec } from 'child_process';
import fs from 'fs'
const app = express();

import { userRouter } from "./routes/userRoutes";
import { codeRouter } from "./routes/codeRoutes";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
config();

app.use("/user", userRouter);
app.use('/code', codeRouter)

app.use('/test', (req, res) => {
    // Create and write to a Python file
    const pythonCode = `print("Hello, World! qqqqqqqqqqqqqqqqq")`;
    fs.writeFileSync('temp.py', pythonCode);

    // Run the Python file as a child process
    exec('python3 temp.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python file: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }

        console.log(`Python file output: ${stdout}`);

        // Remove the temporary Python file
        // fs.unlinkSync('temp.py');

        res.status(200).send(`Python file output: ${stdout}`);
    });
});

dbConnect();
app.listen(4000, () => {
    console.log("Server is running on port " + 4000);
});