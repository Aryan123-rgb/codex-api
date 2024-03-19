import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { compileCppCode, compileJavascriptCode, compilePythonCode, createNewRepl, getAllCodes, loadCode, saveCode } from "../controllers/codeController";
export const codeRouter = express.Router();

codeRouter.post("/create-new-repl", verifyToken, createNewRepl);
codeRouter.get("/load/:id", verifyToken, loadCode);
codeRouter.post("/compile-python-code", compilePythonCode);
codeRouter.post("/compile-javascript-code", compileJavascriptCode);
codeRouter.post("/compile-cpp-code", compileCppCode);
codeRouter.get("/get-all-codes", verifyToken, getAllCodes);
codeRouter.post("/save/:id", verifyToken, saveCode);