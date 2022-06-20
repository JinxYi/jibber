
import express from "express";
const router = express.Router();
import User from "../model/user.js";


/**
 * POST /api/user/register
 */
router.get("/register",
    async (req, res) => {
        const { groupId, userId } = req.query;
        try {
            console.time("POST register user");
            const result = await User.registerUser(groupId, userId);
            res.status(201).send(result);
        } catch (err) {
            res.status(500).send({ error: "Error registering user", code: "UNEXPECTED_ERROR" });
        } finally {
            console.timeEnd("POST register user");
        }
    });


export default router;