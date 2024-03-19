import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { compileCppCode, compileJavascriptCode, compilePythonCode, createNewRepl, getAllCodes, loadCode, saveCode } from "../controllers/codeController";
export const codeRouter = express.Router();

codeRouter.post("/create-new-repl", createNewRepl);
codeRouter.get("/load/:id", loadCode);
codeRouter.post("/compile-python-code", compilePythonCode);
codeRouter.post("/compile-javascript-code", compileJavascriptCode);
codeRouter.post("/compile-cpp-code", compileCppCode);
codeRouter.get("/get-all-codes", getAllCodes);
codeRouter.post("/save/:id", saveCode);