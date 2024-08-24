"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJwtToken = (user) => {
    const jwtToken = jsonwebtoken_1.default.sign({
        _id: user._id,
        email: user.email,
    }, process.env.JWT_KEY);
    return jwtToken;
};
exports.createJwtToken = createJwtToken;
