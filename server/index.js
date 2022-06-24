// server/index.js
import 'dotenv/config';
import express from "express";
import cors from "cors";
import userController from "./controller/userController.js";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
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

app.use(express.urlencoded({ extended: false }));

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

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});



app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // console.log(data);
        client.send(data, { binary: isBinary });
      }
    });
  });
});