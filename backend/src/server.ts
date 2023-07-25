import dotenv from 'dotenv';
const http = require("http");
dotenv.config();
require("dotenv").config();
import path from 'path';
import express from "express";
import cors from "cors";
import userRouter from './routers/user.router';
import { dbConnect } from './configs/database.config';
dbConnect();

const app = express();
const server = http.createServer(app);
// const io = socketio(server);
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:true
}));

app.use("/api/users", userRouter);
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})