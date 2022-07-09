import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import Redis from "ioredis";
import connectRedis from "connect-redis";

import userController from "./controller/userController.js";
import conversationController from "./controller/conversationController.js";

const PORT = process.env.BACKEND_PORT || 3001;

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const RedisStore = connectRedis(session); //Configure redis client
const redisClient = new Redis ({
  host: "localhost",
  port: 6379
});

redisClient.on("error", (err) => {
  console.log("Could not establish a connection with redis.", err);
});
redisClient.on("connect", (err) => {
  console.log("Connected to redis successfully");
});

app.use(cors({
  origin: process.env.FRONTEND_HOST || "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}));

app.use(session({
  store: new RedisStore({ client: redisClient }),
  name: "_jibber_client_psi", // psi = persistent session id
  secret: process.env.SESSION_MI,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "none"
  }
}));

app.use(express.json({
  verify: (_req, res, buf, _encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      // returns error if body is not json
      return res.status(400).send({ error: "Invalid Request Body", code: "INVALID_JSON_BODY" });
    }
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// logging middleware
app.use((req, _res, next) => {
  // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
  console.log("\x1b[43m\x1b[30m", req.method, "\x1b[0m\x1b[1m", req.path, "\x1b[0m");
  if (Object.keys(req.query).length !== 0)
    console.log("\x1b[34mquery:\x1b[0m", req.query);
  if (Object.keys(req.body).length !== 0)
    console.log("\x1b[34mbody:\x1b[0m", req.body);
  next();
});

app.use("/api/user", userController);
app.use("/api/session", conversationController);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use((err, req, res, next) => {
  console.log("An error occured", err);
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // console.log(data);
        client.send(data, { binary: isBinary });
      }
    });
  });
});