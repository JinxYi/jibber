
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

}

export default Message;