import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/verifyToken";
import { Code } from "../models/Code";
import { User } from "../models/User";
import fs from 'fs'
import { exec } from 'child_process'

export const createNewRepl = async (req: AuthRequest, res: Response) => {
    const { title, language } = req.body;
    const userId = req._id;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ error: true, message: "User not found" })
        }

        const repl = await Code.create({ userId, title, language, userName: user.username })

        return res.status(200).json({
            error: false, message: `${language} repl created`, data: repl
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: true, message: error });
    }
}

export const loadCode = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const repl = await Code.findById(id);

        if (!repl) {
            return res.status(404).json({ error: true, message: 'Repl not found' });
        }

        return res.status(200).json({
            error: false, message: `Repl Data fetched`, data: repl
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: true, message: error });
    }
}

export const getAllCodes = async (req: AuthRequest, res: Response) => {
    const userId = req._id;
    try {
        const codes = await Code.find({ userId: userId });
        return res.json({ error: false, message: 'ok', data: codes })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: true, message: error });
    }
}

export const compilePythonCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).send('No Python code provided.');
        }

        const pythonCode = `${code}`;
        fs.writeFileSync('temp.py', pythonCode);

        exec('python3 temp.py', (error, stdout, stderr) => {
            if (error) {
                console.log(`Error executing Python file: ${error.message}`);
                return res.status(500).send('Internal Server Error');
            }

            fs.unlinkSync('temp.py');

            if (stderr) {
                console.error(`Python stderr: ${stderr}`);
            }

            res.status(200).json(stdout);
        });
    } catch (err) {
        console.log(`Error compiling Python code: ${err}`);
        res.status(500).send('Internal Server Error');
    }
};

export const compileJavascriptCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).send('No JavaScript code provided.');
        }

        const javascriptCode = `${code}`;
        fs.writeFileSync('index.js', javascriptCode);

        exec('node index.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing JavaScript file: ${error.message}`);
                return res.status(500).send('Internal Server Error');
            }

            fs.unlinkSync('index.js');

            if (stderr) {
                console.error(`JavaScript stderr: ${stderr}`);
            }

            res.status(200).json(stdout);
        });
    } catch (err) {
        console.error(`Error compiling JavaScript code: ${err}`);
        res.status(500).send('Internal Server Error');
    }
};

export const compileCppCode = async (req: Request, res: Response) => {
    const { code } = req.body;

    fs.writeFileSync('main.cpp', code);

    exec('g++ main.cpp -o main', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error compiling C++ code: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }

        if (stderr) {
            console.error(`Compilation warning: ${stderr}`);
        }

        exec('./main', (execError, execStdout, execStderr) => {
            if (execError) {
                console.error(`Error executing compiled binary: ${execError.message}`);
                return res.status(500).send('Internal Server Error');
            }

            if (execStderr) {
                console.error(`Execution warning: ${execStderr}`);
            }

            // Remove the temporary files
            fs.unlinkSync('main.cpp');
            fs.unlinkSync('main');

            // Send the output of the compiled code
            res.status(200).json(execStdout);
        });
    });
};

export const saveCode = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fullCode } = req.body;

        // Find the code document by ID
        const code = await Code.findById(id);

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
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};