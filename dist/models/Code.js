"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CodeSchema = new mongoose_1.default.Schema({
    code: {
        html: String,
        css: String,
        javascript: String,
        python: String,
    },
    language: String,
    title: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    userName: String,
}, { timestamps: true });
exports.Code = mongoose_1.default.model("Code", CodeSchema);
