import jwt from "jsonwebtoken";
import { IUserSchema } from "../models/User";
import mongoose from "mongoose";

interface User extends IUserSchema {
    _id: mongoose.Types.ObjectId;
}

export const createJwtToken = (user: User): string => {
    const jwtToken = jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        process.env.JWT_KEY!
    );

    return jwtToken;
};
