import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../model/user.js";

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
