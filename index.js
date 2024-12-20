import { App } from "@tinyhttp/app";
// import { logger } from "@tinyhttp/logger";
// import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import routes from "./routes/routes.js";

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_NAME = process.env.MONGODB_NAME;
const MONGODB_HOST = process.env.MONGODB_HOST;
const MONGODB_PORT = process.env.MONGODB_PORT;

const app = new App({
    // 未定义的界面均返回 404
    noMatchHandler: (_, res) => void res.status(404).json({ code: 404, message: "Not Found", data: null }),
});

/*
NOTE: 在高并发的情境下不记录日志能大幅提高并发量
app.use(logger({
    methods: ["GET", "POST"],
    timestamp: { format: "YYYY-MM-DD HH:mm:ss" },
    output: { callback: console.log, color: false, filename: "./logs/tinyhttp.log", ip: true }
}));
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const client = new MongoClient(`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}?authSource=admin`);

async function startServer() {
    try {
        // await client.connect();
        await mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}?authSource=admin`);
        console.log("Connected to MongoDB");

        // const db = client.db("xunfang");
        // userRoutes(app, mongoose);
        app.options("*", (_, res) => res.send());
        routes(app);

        app.listen(process.env.PORT | 3000, () => console.log(`Server listening on port ${process.env.PORT | 3000}`));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

startServer().catch(console.error);

const closeConnect = async (event) => {
    console.log(`Received ${event} signal. Closing MongoDB connection...`);
    // await client.close();
    await mongoose.connection.close();
    console.log("Closed connection to MongoDB server.");
    process.exit(0);
};

// 在进程退出时关闭 MongoDB 连接
process.on("SIGINT", async () => {
    await closeConnect("SIGINT");
});
process.on("SIGTERM", async () => {
    await closeConnect("SIGTERM");
});
