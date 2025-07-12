import { Server } from 'http';

import mongoose from 'mongoose';
import app from './app';
import { envVars } from './config/env';


let server: Server

const startSever = async () => {
    console.log();
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log('db is connected');
        server = app.listen(5000, () => {
            console.log('sever is listing to port  5000');
        })
    } catch (error) {
        console.log(error);
    }
}
startSever()


process.on("SIGTERM", () => {
    console.log("Sigterm received ....sever shuting d");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})

process.on("SIGINT", () => {
    console.log("SIGINT signal  received ....sever shuting down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})


process.on("unHandleRejection", (err) => {
    console.log("unHandle Rejection detected", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})
process.on("uncaughtException", (err) => {
    console.log("Un caught exception detected", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})
throw new Error('im forgat to catch this promice ') 