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
    const { code } = req.body
    const pythonCode = `${code}`;
    fs.writeFileSync('temp.py', pythonCode);

    // Run the Python file as a child process
    exec('python3 temp.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python file: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }

        // Remove the temporary Python file
        fs.unlinkSync('temp.py');

        res.status(200).json(stdout);
    });
}