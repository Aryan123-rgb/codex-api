"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCode = exports.compileCppCode = exports.compileJavascriptCode = exports.compilePythonCode = exports.getAllCodes = exports.loadCode = exports.createNewRepl = void 0;
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
            error: false, message: `${language} repl created`, data: repl
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
            error: false, message: `Repl Data fetched`, data: repl
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
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).send('No Python code provided.');
        }
        const pythonCode = `${code}`;
        fs_1.default.writeFileSync('temp.py', pythonCode);
        (0, child_process_1.exec)('python3 temp.py', (error, stdout, stderr) => {
            if (error) {
                console.log(`Error executing Python file: ${error.message}`);
                return res.status(500).send('Internal Server Error');
            }
            fs_1.default.unlinkSync('temp.py');
            if (stderr) {
                console.error(`Python stderr: ${stderr}`);
            }
            res.status(200).json(stdout);
        });
    }
    catch (err) {
        console.log(`Error compiling Python code: ${err}`);
        res.status(500).send('Internal Server Error');
    }
};
exports.compilePythonCode = compilePythonCode;
const compileJavascriptCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).send('No JavaScript code provided.');
        }
        const javascriptCode = `${code}`;
        fs_1.default.writeFileSync('index.js', javascriptCode);
        (0, child_process_1.exec)('node index.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing JavaScript file: ${error.message}`);
                return res.status(500).send('Internal Server Error');
            }
            fs_1.default.unlinkSync('index.js');
            if (stderr) {
                console.error(`JavaScript stderr: ${stderr}`);
            }
            res.status(200).json(stdout);
        });
    }
    catch (err) {
        console.error(`Error compiling JavaScript code: ${err}`);
        res.status(500).send('Internal Server Error');
    }
};
exports.compileJavascriptCode = compileJavascriptCode;
const compileCppCode = async (req, res) => {
    const { code } = req.body;
    fs_1.default.writeFileSync('main.cpp', code);
    (0, child_process_1.exec)('g++ main.cpp -o main', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error compiling C++ code: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
        if (stderr) {
            console.error(`Compilation warning: ${stderr}`);
        }
        (0, child_process_1.exec)('./main', (execError, execStdout, execStderr) => {
            if (execError) {
                console.error(`Error executing compiled binary: ${execError.message}`);
                return res.status(500).send('Internal Server Error');
            }
            if (execStderr) {
                console.error(`Execution warning: ${execStderr}`);
            }
            // Remove the temporary files
            fs_1.default.unlinkSync('main.cpp');
            fs_1.default.unlinkSync('main');
            // Send the output of the compiled code
            res.status(200).json(execStdout);
        });
    });
};
exports.compileCppCode = compileCppCode;
const saveCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullCode } = req.body;
        // Find the code document by ID
        const code = await Code_1.Code.findById(id);
        if (!code) {
            return res.status(404).json({ error: true, message: 'Code not found' });
        }
        code.code = fullCode;
        await code.save();
        return res.status(200).json({
            error: false,
            message: 'Code saved successfully',
            data: code,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};
exports.saveCode = saveCode;
