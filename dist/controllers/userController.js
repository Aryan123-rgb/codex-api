"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetails = exports.logout = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const jwt_1 = require("../lib/jwt");
const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    try {
        const existingUser = await User_1.User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ error: true, message: "User already exists!" });
        }
        if (!usernameRegex.test(username)) {
            return res
                .status(400)
                .send({ error: true, message: "Invalid Username" });
        }
        const salt = await bcrypt_1.default.genSalt();
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const user = await User_1.User.create({
            email: email,
            password: hashedPassword,
            username: username,
        });
        const jwtToken = (0, jwt_1.createJwtToken)(user);
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, message: error });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(400).send({ error: true, message: "Email not registered yet" });
        }
        const passwordMatched = await bcrypt_1.default.compare(password, existingUser.password);
        if (!passwordMatched) {
            return res.status(400).json({ error: true, message: "Wrong password" });
        }
        const jwtToken = (0, jwt_1.createJwtToken)(existingUser);
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, message: error });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).send({ error: false, message: "logged out successfully!" });
    }
    catch (error) {
        return res.status(500).send({ error: true, message: error });
    }
};
exports.logout = logout;
const userDetails = async (req, res) => {
    const userId = req._id;
    try {
        const user = await User_1.User.findById(userId);
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
    }
    catch (error) {
        return res.status(500).send({ message: "Cannot fetch user details" });
    }
};
exports.userDetails = userDetails;
