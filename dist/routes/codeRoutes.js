"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeRouter = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const codeController_1 = require("../controllers/codeController");
exports.codeRouter = express_1.default.Router();
exports.codeRouter.post("/create-new-repl", verifyToken_1.verifyToken, codeController_1.createNewRepl);
exports.codeRouter.get("/load/:id", verifyToken_1.verifyToken, codeController_1.loadCode);
exports.codeRouter.post("/compile-python-code", codeController_1.compilePythonCode);
exports.codeRouter.post("/compile-javascript-code", codeController_1.compileJavascriptCode);
exports.codeRouter.post("/compile-cpp-code", codeController_1.compileCppCode);
exports.codeRouter.get("/get-all-codes", verifyToken_1.verifyToken, codeController_1.getAllCodes);
exports.codeRouter.post("/save/:id", verifyToken_1.verifyToken, codeController_1.saveCode);
