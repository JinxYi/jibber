import JibberError from "./jibberError";

class Member {
    constructor(id, chatSessionId, userId, role = "member") {
        this.id = id;
        this.chatSessionId = chatSessionId; // FK ChatSession
        this.userId = userId; // FK User
        this.role = role;
    }

    /**
     * Returns x raised to the n-th power.
     *
     * @param {Array} userList An array of users including their chat sessionid, userId and role
     */
    static createChatSession = (userList) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `INSERT INTO chatSession(chatSessionId, userId, role) VALUES (?, ?, ?);`;
                const [rows, fields] = await connection.execute(query, [chatSessionId, userId, role]);
                connection.end();
                if(rows && rows.affectedRows >= 1) resolve();
                else throw new JibberError(JibberError.errorCodes.UNEXPECTED_ERROR);
            }
            catch(err) {
                reject(err);
            }
        });
    }
}

export default Member;