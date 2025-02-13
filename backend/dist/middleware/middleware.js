"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
dotenv_1.default.config();
const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "randomjwtsecret";
function userMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            console.log("token" + token);
            if (!token) {
                res.status(401).json({
                    message: "No token exist , auth denied"
                });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, USER_JWT_SECRET);
            console.log(decoded);
            const userDoc = yield db_1.UserModel.findById(decoded.id);
            if (!userDoc) {
                res.status(404).json({
                    message: "User not found"
                });
                return;
            }
            const user = {
                email: userDoc.email || "",
                password: userDoc.password || "",
                username: userDoc.username || "",
                userId: userDoc._id.toString(),
            };
            req.user = user;
            next();
        }
        catch (error) {
            console.error("Error in middleware", error);
            res.status(401).json({
                message: "Token is not valid"
            });
            return;
        }
    });
}
exports.default = userMiddleware;
