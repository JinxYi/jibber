import session from "express-session";
// import Redis from "ioredis";
// import connectRedis from "connect-redis";


// const RedisStore = connectRedis(session); //Configure redis client
// const redisClient = new Redis({
//     host: "localhost",
//     port: 6379
// });

// redisClient.on("error", (err) => {
//     console.log("Could not establish a connection with redis.", err);
// });
// redisClient.on("connect", (err) => {
//     console.log("Connected to redis successfully");
// });

export default session({
    // store: new RedisStore({ client: redisClient }),
    name: "_jibber_client_psi", // psi: persistent session id
    secret: process.env.SESSION_MI,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "none",
        domain: process.env.DOMAIN,
        sameSite: "strict",
        path: "/",
        // secure: "true"
    }
});