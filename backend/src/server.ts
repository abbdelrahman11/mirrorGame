import dotenv from "dotenv";
const http = require("http");
const cookieSession = require("cookie-session");
const passport = require("passport");
dotenv.config();
require("dotenv").config();
import path from "path";
import express from "express";
import cors from "cors";
import userRouter from "./routers/user.router";
import googleLoginRouter from "./routers/googleLogin";
import { dbConnect } from "./configs/database.config";
dbConnect();
require("./passport");
const app = express();
const server = http.createServer(app);
// const io = socketio(server);
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

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// app.use(
//     cors({
//         credentials: true,
//         origin: true,
//   })
// );

app.use("/api/users", userRouter);
app.use("/auth", googleLoginRouter);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
});
