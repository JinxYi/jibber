import { getConnection } from "../database/databaseConfig.js";

class Message {
    constructor(id, messageContent, messageAttachment, messageAttachmentType, messageTime, messageTimezone, chatSessionId, senderId) {
        this.id = id;
        this.messageContent = messageContent;
        this.messageAttachment = messageAttachment;
        this.messageAttachmentType = messageAttachmentType;
        this.messageTime = messageTime;
        this.messageTimezone = messageTimezone;
        this.chatSessionId = chatSessionId; // FK ChatSession
        this.senderId = senderId; // FK User   
    }
    static createMessage = (messageContent, messageTimezone, chatSessionId, senderId, messageTime = null, messageAttachment = null, messageAttachmentType = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `INSERT INTO message(messageContent, messageAttachment, messageAttachmentType, messageTimezone, chatSessionId, senderId) VALUES(?, ?, ?, ?, ?, ?);`;
                const [rows, fields] = await connection.execute(query, [messageContent, messageAttachment, messageAttachmentType, messageTimezone, chatSessionId, senderId]);
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

export default Message;