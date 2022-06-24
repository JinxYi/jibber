
import express from "express";
const router = express.Router();
import User from "../model/user.js";
import JibberError from "../model/jibberError.js";

/**
 * POST /api/user/register
 */
router.post("/register",
    async (req, res) => {
        const { username, email, password } = req.body;
        try {
            console.time("POST register user");
            await User.registerUser(username, email, password);
            res.status(201).end();
        } catch (err) {
            if(err instanceof JibberError) res.status(422).send({ error: err.message, code: err.code });
            else {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error registering user", code: "UNEXPECTED_ERROR" });
            }
        } finally {
            console.timeEnd("POST register user");
        }
    });

/**
 * POST /api/user/login
 */
router.post("/login",
    async (req, res) => {
        const { email, password } = req.body;
        try {
            console.time("POST login user");
            await User.loginUser(email, password);
            res.status(200).end();
        } catch (err) {
            if(err instanceof JibberError) res.status(401).send({ error: err.message, code: err.code });
            else {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error authenticating user", code: "UNEXPECTED_ERROR" });
            }
        } finally {
            console.timeEnd("POST login user");
        }
    });

/**
 * GET /api/user/search
 */
router.get("/search",
    async (req, res) => {
        const { q } = req.query;
        try {
            console.time("POST login user");
            const result = await User.searchUser(q);
            res.status(200).send(result);
        } catch (err) {
            console.log("Unexpected Error:", err);
            res.status(500).send({ error: "Error searching user", code: "UNEXPECTED_ERROR" });
        } finally {
            console.timeEnd("POST login user");
        }
    });


export default router;