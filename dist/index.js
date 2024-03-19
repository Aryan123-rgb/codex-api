"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = require("./lib/dbConnect");
const app = (0, express_1.default)();
(0, dotenv_1.config)();
const userRoutes_1 = require("./routes/userRoutes");
const codeRoutes_1 = require("./routes/codeRoutes");
const body_parser_1 = __importDefault(require("body-parser"));
console.log(process.env.REACT_APP_BASE_URL);
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.REACT_APP_BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/user", userRoutes_1.userRouter);
app.use('/code', codeRoutes_1.codeRouter);
(0, dbConnect_1.dbConnect)();
app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + 4000);
});
