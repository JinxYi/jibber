
import express from "express";
const router = express.Router();
import passport from "passport";
import User from "../model/user.js";
import JibberError from "../model/jibberError.js";
import LocalStrategy from "passport-local";

passport.use(new LocalStrategy(
    {
        usernameField: "email", passwordField: "password"
    },
    async (email, password, done) => {
        try {
            const user = await User.loginUser(email, password);
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findUserById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

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
            if (err instanceof JibberError) res.status(422).send({ error: err.message, code: err.code });
            else {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error registering user", code: "UNEXPECTED_ERROR" });
            }
        } finally {
            console.timeEnd("POST register user");
        }
    }
);

/**
 * POST /api/user/login
 */
router.post("/login",
    passport.authenticate("local", { failWithError: true }),
    (req, res, next) => {
        res.status(200).end();
    },
    (err, req, res, next) => {
        console.log("Unexpected Error:", err);
        if (err.message && err.code) res.status(401).send({ error: err.message, code: err.code });
        else res.status(500).send({ error: "Error authenticating user", code: "UNEXPECTED_ERROR" });
    }
);

/**
 * GET /api/user/search
 */
router.get("/search",
    async (req, res, next) => {
        if (req.isAuthenticated()) {
            const { q } = req.query;
            try {
                const result = await User.searchUser(q);
                res.status(200).send(result);
            } catch (err) {
                console.log("Unexpected Error:", err);
                res.status(500).send({ error: "Error searching user", code: "UNEXPECTED_ERROR" });
            }
        }
        else {
            res.status(401).send({ error: "Error authenticating user", code: JibberError.errorCodes.UNAUTHORIZED });
        }
    }
);



export default router;