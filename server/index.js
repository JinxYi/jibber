import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import WebSocket, { WebSocketServer } from "ws";
import helmet from "helmet";

import JibberError from "./model/jibberError.js";
import userController from "./controller/userController.js";
import sessionController from "./controller/sessionController.js";
import { sendMessage } from "./controller/messageController.js";

import { log } from "./config/logging.js";
import sessionParser from "./config/sessionStore.js";

const PORT = process.env.BACKEND_PORT || 3001;

const app = express();
app.use(helmet()); // view helmet docs for more options
app.disable("x-powered-by");

app.use(cors({
  origin: process.env.FRONTEND_HOST || "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}));


app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session());
import "./config/passportStrategy.js"; // strategy config

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json({
  verify: (_req, res, buf, _encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      return res.status(400).send({ error: "Invalid Request Body", code: "INVALID_JSON_BODY" });
    }
  }
}));

app.use(log); // logging middleware


/**
 * Route map
 */
app.use("/api/user", userController);
app.use("/api/session", sessionController);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Uncaught error handler
app.use((err, req, res, next) => {
  console.log("An unexpected error occured", err);
  res.status(500).send("An unexpected error occured on the server");
});

// Not found
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

const server = http.createServer(app);

const wss = new WebSocketServer({ port: 8080 });


// TODO: IS THIS EVEN WORKING?? no??
server.on("upgrade", (request, socket, head) => {
  console.log("Parsing session from request...");

  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    console.log("Session is parsed!");

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit("connection", ws, request);
    });
  });
});


// wss.on("connection", (ws, request) => {
//   let userId = null;
//   sessionParser(request, {}, () => {
//     if (!request.session.passport || !request.session.passport.user) {
//       console.log("Client is unauthorised. Closing connection..");
//       ws.close();
//       return;
//     }
//     else userId = request.session.passport.user;
//   });
//   ws.on("message", (dataString, isBinary) => {
//     let data;
//     let error;
//     try {
//       data = JSON.parse(dataString);
//       switch (data.type) {
//         case "message.send": {
//           data.senderId = userId;
//           sendMessage(data);
//           break;
//         }
//       }
//     } catch (err) {
//       if (err instanceof SyntaxError) error = { "code": JibberError.errorCodes.INVALID_JSON };
//     }

//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         if(error) {
//           return client.send(JSON.stringify(error));
//         }
//         else {
//           client.send(JSON.stringify(data), { binary: isBinary });
//         }
//       }
//     });
//   });

//   ws.on("close", function close() {
//     console.log("Disconnected");
//   });
  
// });

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});