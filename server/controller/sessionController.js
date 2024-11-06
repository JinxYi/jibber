
import express from "express";
const router = express.Router();
import ChatSession from "../model/chatSession.js";
import Member from "../model/member.js";
import JibberError from "../model/jibberError.js";


/**
 * GET /api/session/
 */
router.get("/",
    async (req, res) => {
        try {
            if (!req.isAuthenticated() || !req.user.id) throw new JibberError(JibberError.errorCodes.UNAUTHORIZED);
            const chatList = await ChatSession.getChatSessionByUserId(req.user.id);
            res.status(200).send({ "chatList": chatList });
        } catch (err) {
            if (err instanceof JibberError) {
                if (err.code == JibberError.errorCodes.UNAUTHORIZED) res.status(401).send({ error: err.message, code: err.code });
                else res.status(422).send({ error: err.message, code: err.code });
            }
            else {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error creating chat session", code: "UNEXPECTED_ERROR" });
            }
        }
    }
);

/**
 * POST /api/session/messages/:sessionId
 */
router.post("/messages/:sessionId",
    async (req, res) => {
        try {
            const { sessionId } = req.params;
            if (!req.isAuthenticated() || !req.user.id) throw new JibberError(JibberError.errorCodes.UNAUTHORIZED);
            const messages = await ChatSession.getChatSessionById(sessionId);
            res.status(200).send({ "messages": messages });
        } catch (err) {
            if (err instanceof JibberError) {
                if (err.code == JibberError.errorCodes.UNAUTHORIZED) res.status(401).send({ error: err.message, code: err.code });
                else res.status(422).send({ error: err.message, code: err.code });
            }
            else {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error creating chat session", code: "UNEXPECTED_ERROR" });
            }
        }
    }
);

/**
 * POST /api/session/exists
 */
router.post("/exists",
    async (req, res) => {
        const { sendeeId } = req.body;
        try {
            if (!req.isAuthenticated() || !req.user.id) throw new JibberError(JibberError.errorCodes.UNAUTHORIZED);
            const exists = await ChatSession.checkPrivChatExists(req.user.id, sendeeId);
            res.status(200).send({ "exists": exists });
        } catch (err) {
            if (err instanceof JibberError) res.status(422).send({ error: err.message, code: err.code });
            else {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error registering user", code: "UNEXPECTED_ERROR" });
            }
        }
    }
);

/**
 * POST /api/session/create
 */
router.post("/create",
    async (req, res) => {
        const { sendeeId } = req.body;
        try {
            if (!req.isAuthenticated() || !req.user.id) throw new JibberError(JibberError.errorCodes.UNAUTHORIZED);
            const newChatId = await Member.createChatSession(req.user.id, sendeeId);
            res.status(201).send({ "chatId": newChatId });
        } catch (err) {
            if (err instanceof JibberError) {
                if (err.code == JibberError.errorCodes.UNAUTHORIZED) res.status(401).send({ error: err.message, code: err.code });
                else res.status(422).send({ error: err.message, code: err.code });
            }
            else {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error creating chat session", code: "UNEXPECTED_ERROR" });
            }
        }
    }
);

export default router;