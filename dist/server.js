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
const app_1 = __importDefault(require("./app"));
let server;
const startSever = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect('mongodb+srv://safin33221:0d04s9VNvxNlmL8a@cluster0.blz8y.mongodb.net/ph-tour-Management?retryWrites=true&w=majority&appName=Cluster0');
        console.log('db is connected');
        server = app_1.default.listen(5000, () => {
            console.log('sever is listing to port  5000');
        });
    }
    catch (error) {
        console.log(error);
    }
});
startSever();
process.on("SIGTERM", () => {
    console.log("Sigterm received ....sever shuting d");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on("SIGINT", () => {
    console.log("SIGINT signal  received ....sever shuting down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on("unHandleRejection", (err) => {
    console.log("unHandle Rejection detected", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on("uncaughtException", (err) => {
    console.log("Un caught exception detected", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
throw new Error('im forgat to catch this promice ');
