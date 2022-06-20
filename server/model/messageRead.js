
class MessageRead {
    constructor(id, messageId, userId, readTime) {
        this.id = id;
        this.messageId = messageId;
        this.userId = userId; // FK User
        this.readTime = readTime;
    }
}

export default MessageRead;