"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = require("./lib/dbConnect");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const userRoutes_1 = require("./routes/userRoutes");
const codeRoutes_1 = require("./routes/codeRoutes");
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:5173" }));
(0, dotenv_1.config)();
app.use("/user", userRoutes_1.userRouter);
app.use('/code', codeRoutes_1.codeRouter);
app.use('/test', (req, res) => {
    // Create and write to a Python file
    const pythonCode = `print("Hello, World! qqqqqqqqqqqqqqqqq")`;
    fs_1.default.writeFileSync('temp.py', pythonCode);
    // Run the Python file as a child process
    (0, child_process_1.exec)('python3 temp.py', (error, stdout, stderr) => {
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
(0, dbConnect_1.dbConnect)();
app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + 4000);
});
