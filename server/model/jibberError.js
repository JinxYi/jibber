
const errorCodes = {
    UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
    USER_EXISTS: "USER_EXISTS",
    CHAT_EXISTS: "CHAT_EXISTS",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    NOT_FOUND: "NOT_FOUND",
    INVALID_JSON: "INVALID_JSON_BODY",
    UNAUTHENTICATED: "UNAUTHENTICATED_USER",
    UNAUTHORIZED: "UNAUTHORIZED_USER"
};

class JibberError extends Error {

    constructor(code = "UNEXPECTED_ERROR", ...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, JibberError)
        }

        this.name = "JibberError";
        // Custom debugging information
        this.code = code;
    }
    static get errorCodes() {
        return errorCodes;
    }
}

export default JibberError;