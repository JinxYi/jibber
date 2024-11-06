
export const log = (req, _res, next) => {
    // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    console.log("\x1b[43m\x1b[30m", req.method, "\x1b[0m\x1b[1m", req.path, "\x1b[0m");
    if (Object.keys(req.query).length !== 0)
        console.log("\x1b[34mquery:\x1b[0m", req.query);
    if (Object.keys(req.body).length !== 0)
        console.log("\x1b[34mbody:\x1b[0m", req.body);
    next();
}