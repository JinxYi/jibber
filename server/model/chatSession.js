import { getConnection } from "../database/databaseConfig.js"; 

class ChatSession {
    constructor(id, groupName, isPrivate) {
        this.id = id
        this.groupName = groupName;
        this.isPrivate = isPrivate;
    }
    static createChatSession = (groupName, isPrivate = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `INSERT INTO chatSession(groupName, isPrivate) VALUES(?, ?);`;
                const [rows, fields] = await connection.execute(query, [groupName, isPrivate]);
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