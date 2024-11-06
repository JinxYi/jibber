
import Message from "../model/message.js";

export const sendMessage = async ({messageContent, messageTimezone, chatSessionId, senderId}) => {
    await Message.createMessage(messageContent, messageTimezone, chatSessionId, senderId);
}
