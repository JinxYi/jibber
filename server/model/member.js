
class Member {
    constructor(id, chatSessionId, userId, role = "member") {
        this.id = id;
        this.chatSessionId = chatSessionId; // FK ChatSession
        this.userId = userId; // FK User
        this.role = role;
    }
}

export default Member;