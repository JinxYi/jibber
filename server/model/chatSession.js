import { getConnection } from "../database/databaseConfig.js"; 

class ChatSession {
    constructor(id, groupName, isPrivate, userOneId, userTwoId) {
        this.id = id
        this.groupName = groupName;
        this.isPrivate = isPrivate;
        this.userOneId = userOneId;
        this.userTwoId = userTwoId;
    }
    static createChatSession = (groupName, isPrivate = null, userOneId = null, userTwoId = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `SELECT * FROM chatSession(groupName, isPrivate, userOneId, userTwoId) VALUES(?, ?, ?, ?);`;
                const [rows, fields] = await connection.execute(query, [groupName, isPrivate, userOneId, userTwoId]);
                connection.end();
                if(rows && rows.affectedRows >= 1) resolve(rows.insertId);
            }
            catch(err) {
                reject(err);
            }
        });
    }
}

export default ChatSession;