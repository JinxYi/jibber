
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
    static createMessage = (messageContent, messageAttachment, messageAttachmentType, messageTime, messageTimezone, chatSessionId, senderId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `INSERT INTO chatSession VALUES(?, ?, ?, ?, ?, ?, ?);`;
                const [rows, fields] = await connection.execute(query, [messageContent, messageAttachment, messageAttachmentType, messageTime, messageTimezone, chatSessionId, senderId]);
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