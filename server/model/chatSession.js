import { getConnection } from "../database/databaseConfig.js"; 
import JibberError from "./jibberError.js";

class ChatSession {
    constructor(id, groupName, isPrivate) {
        this.id = id
        this.groupName = groupName;
        this.isPrivate = isPrivate;
    }
    static getChatSessionByUserId = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `
                SELECT 
                    userChats.chatSessionId as id, userId, username, profilePicture, messageContent as lastMessage, messageTime as lastMessageTime
                FROM message
                INNER JOIN (
                    SELECT
                        member.userId,
                        member.chatSessionId,
                        user.username,
                        user.profilePicture
                    FROM member, user
                    WHERE
                        user.id = member.userId
                        AND
                        member.userId != ?
                        AND
                        member.chatSessionId IN (
                            SELECT chatSession.id
                            FROM
                                chatSession
                            WHERE chatSession.id IN (
                                SELECT
                                    member.chatSessionId
                                FROM member
                                WHERE
                                    member.userId = ?
                                )
                            )
                        ) AS userChats
                        ON message.chatSessionId = userChats.chatSessionId
                        ORDER BY messageTime DESC LIMIT 1;`

                // `
                //     SELECT 
                //         userChats.chatSessionId as id, userId, username, profilePicture, messageContent as lastMessage, messageTime as lastMessageTime
                //     FROM message
                //     RIGHT JOIN (
                //         SELECT
                //             member.userId,
                //             member.chatSessionId,
                //             user.username,
                //             user.profilePicture
                //         FROM member, user
                //         WHERE
                //             user.id = member.userId
                //             AND
                //             member.userId != ?
                //             AND
                //             member.chatSessionId IN (
                //                 SELECT chatSession.id
                //                 FROM
                //                     chatSession
                //                 WHERE chatSession.id IN (
                //                     SELECT
                //                         member.chatSessionId
                //                     FROM member
                //                     WHERE
                //                         member.userId = ?
                //                     )
                //                 )
                //             ) AS userChats
                //             ON userChats.chatSessionId = (
                //                 SELECT MAX(id)
                //                 FROM message
                //                 WHERE chatSessionId = userChats.chatSessionId
                //             );
                //         `;
                const [rows, _fields] = await connection.execute(query, [userId, userId]);
                connection.end();
                if(rows) resolve(rows);
                else throw new JibberError(JibberError.errorCodes.UNEXPECTED_ERROR);
            } catch(err) {
                console.log(err);
                reject(err);
            }
        });
    }
    static getChatSessionById = (chatSessionId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `
                    SELECT *
                    FROM message
                    WHERE chatSessionId = ?;
                `;
                const [rows, _fields] = await connection.execute(query, [chatSessionId]);
                connection.end();
                if(rows) resolve(rows);
                else throw new JibberError(JibberError.errorCodes.UNEXPECTED_ERROR);
            } catch(err) {
                reject(err);
            }
        });
    }
    static checkPrivChatExists = (userId1, userId2) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `
                    SELECT 
                        member.chatSessionId as "id"
                    FROM
                        member, chatSession
                    WHERE
                        member.chatSessionId = chatSession.id
                        AND
                        member.userId = ?
                        AND
                        chatSession.isPrivate = true
                        AND chatSession.id IN (
                            SELECT
                                chatSession.id
                            FROM member, chatSession
                            WHERE
                                member.chatSessionId = chatSession.id
                                AND
                                member.userId = ?
                        );
                    `;
                const [rows, fields] = await connection.execute(query, [userId1, userId2]);
                connection.end();
                resolve(rows.length > 0? rows[0].id : false);
            } catch (err) {
                reject(err);
            }
        });
    }
}

export default ChatSession;