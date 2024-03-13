"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilePythonCode = exports.getAllCodes = exports.loadCode = exports.createNewRepl = void 0;
const Code_1 = require("../models/Code");
const User_1 = require("../models/User");
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const createNewRepl = async (req, res) => {
    const { title, language } = req.body;
    const userId = req._id;
    try {
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: true, message: "User not found" });
        }
        const repl = await Code_1.Code.create({ userId, title, language, userName: user.username });
        return res.status(200).json({
            error: false, message: `${language} repl created`, data: {
                replId: repl._id,
                title: repl.title,
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, message: error });
    }
};
exports.createNewRepl = createNewRepl;
const loadCode = async (req, res) => {
    const { id } = req.params;
    try {
        const repl = await Code_1.Code.findById(id);
        if (!repl) {
            return res.status(404).json({ error: true, message: 'Repl not found' });
        }
        return res.status(200).json({
            error: false, message: `Repl Data fetched`, repl
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, message: error });
    }
};
exports.loadCode = loadCode;
const getAllCodes = async (req, res) => {
    const userId = req._id;
    try {
        const codes = await Code_1.Code.find({ userId: userId });
        return res.json({ error: false, message: 'ok', data: codes });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, message: error });
    }
};
exports.getAllCodes = getAllCodes;
const compilePythonCode = async (req, res) => {
    const { code } = req.body;
    const pythonCode = `${code}`;
    fs_1.default.writeFileSync('temp.py', pythonCode);
    // Run the Python file as a child process
    (0, child_process_1.exec)('python3 temp.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python file: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
        // Remove the temporary Python file
        fs_1.default.unlinkSync('temp.py');
        res.status(200).json(stdout);
    });
};
exports.compilePythonCode = compilePythonCode;
