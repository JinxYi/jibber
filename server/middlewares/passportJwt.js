


import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import JibberError from "../model/jibberError.js";
import { findUserById } from "../model/user.js";

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TK_MI;
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await findUserById(jwt_payload.sub);
        if(user) return done(null, user);
        return done(new JibberError(JibberError.errorCodes.NOT_FOUND, "User ID provided does not exist"));
    }
    catch(err) {
        return done(err, false);
    }
}));