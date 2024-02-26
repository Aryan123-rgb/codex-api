import mongoose from "mongoose";

interface ICodeSchema {
    code: {
        html: string;
        css: string;
        javascript: string;
        python: string,
    };
    language: string,
    title: string;
    userId: mongoose.Types.ObjectId | string;
    userName: string;
}

const CodeSchema = new mongoose.Schema<ICodeSchema>(
    {
        code: {
            html: String,
            css: String,
            javascript: String,
            python: String,
        },
        language: String,
        title: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: String,
    },
    { timestamps: true }
);

export const Code = mongoose.model("Code", CodeSchema);