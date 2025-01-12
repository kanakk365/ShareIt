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
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (retries = 5, delay = 5000) {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("Mongo DB Uri in not present in env file");
        }
        yield mongoose_1.default.connect(process.env.MONGO_URI);
    }
    catch (e) {
        console.error(e.message);
        if (retries === 0) {
            process.exit(1);
        }
        else {
            console.log(`Retrying to connect in ${delay / 1000} seconds...`);
            setTimeout(() => connectDB(retries - 1, delay), delay);
        }
    }
});
exports.default = connectDB;
