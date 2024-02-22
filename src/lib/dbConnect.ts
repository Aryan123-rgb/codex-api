import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            dbName: "codex-compiler",
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to database " + error);
    }
};