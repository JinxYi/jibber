
import express from "express";
const router = express.Router();
import Member from "../model/member.js";
import JibberError from "../model/jibberError.js";

/**
 * POST /api/session/create
 */
router.post("/create",
    async (req, res) => {
        const { userId1, userId2 } = req.body;
        try {
            const newChatId = await Member.createChatSession(userId1, userId2);
            res.status(201).send({"chatId": newChatId});
        } catch (err) {
            if (err instanceof JibberError) res.status(422).send({ error: err.message, code: err.code });
            else {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error creating chat session", code: "UNEXPECTED_ERROR" });
            }
        }
    }
);

export default router;