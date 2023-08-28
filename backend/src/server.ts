import dotenv from "dotenv";
import { dbConnect } from "./configs/database.config";
import express from "express";
import cors from "cors";
import userRouter from "./routers/user.router";
import roomsRouter from "./routers/rooms.router";
import cardsRouter from "./routers/cards.router";
import googleLoginRouter from "./routers/googleLogin";
dotenv.config();
require("dotenv").config();
dbConnect();
require("./passport");
const http = require("http");
const cookieSession = require("cookie-session");
const passport = require("passport");
const joinRoom = require("./socketEvents/joinRoom");
// const chatMessage = require("./socketEvents/chatMessage");
// const disconnect = require("./socketEvents/disconnect");
const createRoom = require("./socketEvents/createRoom");
const inRoom = require("./socketEvents/InRoom");
const addAndDeleteCards = require("./socketEvents/addAndDeleteCards");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/cards", cardsRouter);
app.use("/auth", googleLoginRouter);
const onConnection = (socket: any) => {
  console.log("connected");
  joinRoom(io, socket);
  // chatMessage(io, socket);
  // disconnect(io, socket);
  createRoom(io, socket);
  inRoom(io, socket);
  addAndDeleteCards(io, socket);
};

io.on("connection", onConnection);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
});
