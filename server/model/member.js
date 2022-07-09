import JibberError from "./jibberError.js";
import { getConnection } from "../database/databaseConfig.js";

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
    static createChatSession = (userId1, userId2) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();

                const chatExistsQuery = `
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
                const [chatExists, chatExistsFields] = await connection.execute(chatExistsQuery, [userId1, userId2]);
                if (chatExists.length > 0) {
                    throw new JibberError(JibberError.errorCodes.CHAT_EXISTS, "The chat already exists");
                }

                const createChatQuery = `INSERT INTO chatSession(isPrivate) VALUES (true);`;
                const [createChatRows, createChatFields] = await connection.execute(createChatQuery);
                const newChatId = createChatRows.insertId;

                const query = `INSERT INTO member(chatSessionId, userId) VALUES (?, ?), (?, ?);`;
                const [rows, fields] = await connection.execute(query, [newChatId, userId1, newChatId, userId2]);
                connection.end();
                if (rows && rows.affectedRows >= 1) resolve(newChatId);
                else throw new JibberError(JibberError.errorCodes.UNEXPECTED_ERROR);
            }
            catch (err) {
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
                if (rows.length > 0) {
                    // resolve(rows[0].id);
                    throw new JibberError(JibberError.errorCodes.CHAT_EXISTS, "The chat already exists");
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}

export default Member;