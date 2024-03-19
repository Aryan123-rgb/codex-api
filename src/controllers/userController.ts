import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { createJwtToken } from "../lib/jwt";
import { AuthRequest } from "../middlewares/verifyToken";

export const signup = async (req: Request, res: Response) => {
    const { username, email, password }: { username: string; email: string; password: string } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ error: true, message: "User already exists!" });
        }
        if (!usernameRegex.test(username)) {
            return res
                .status(400)
                .send({ error: true, message: "Invalid Username" });
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email: email,
            password: hashedPassword,
            username: username,
        });

        const jwtToken = createJwtToken(user);

        res.cookie("token", jwtToken, {
            secure: true,
            path: "/",
            sameSite: 'none',
            httpOnly: true
        });

        return res.status(201).send({
            error: false,
            message: "SignUp successfull",
            data: {
                username: user.username,
                picture: user.picture,
                email: user.email,
                savedCodes: user.savedCodes,
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: true, message: error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    try {
        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(400).send({ error: true, message: "Email not registered yet" });
        }

        const passwordMatched = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!passwordMatched) {
            return res.status(400).json({ error: true, message: "Wrong password" });
        }

        const jwtToken = createJwtToken(existingUser);

        res.cookie("token", jwtToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: 'none'
        });

        return res.status(200).send({
            error: false,
            message: "Login successfull",
            data: {
                username: existingUser.username,
                picture: existingUser.picture,
                email: existingUser.email,
                savedCodes: existingUser.savedCodes,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, message: error });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        return res.status(200).send({ error: false, message: "logged out successfully!" });
    } catch (error) {
        return res.status(500).send({ error: true, message: error });
    }
};

export const userDetails = async (req: AuthRequest, res: Response) => {
    const userId = req._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: true, message: "Cannot find the user!" });
        }
        return res.status(200).json({
            error: false, message: "User found", data: {
                userId: user._id,
                username: user.username,
                picture: user.picture,
                email: user.email,
                savedCodes: user.savedCodes,
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Cannot fetch user details" });
    }
};
