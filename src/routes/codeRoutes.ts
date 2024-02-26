import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { compilePythonCode, createNewRepl, loadCode } from "../controllers/codeController";
export const codeRouter = express.Router();

codeRouter.post("/create-new-repl", verifyToken, createNewRepl);
codeRouter.get("/load/:id", verifyToken, loadCode);
codeRouter.post("/compile-python-code", compilePythonCode);