import bcrypt from "bcrypt"
import { getConnection } from "../database/databaseConfig.js";
import JibberError from "../model/jibberError.js";

const saltRounds = 11;

class User {
    constructor(id, username, about, countryCode, phone, email, password, profilePicture, isDeleted) {
        this.id = id;
        this.username = username;
        this.about = about;
        this.countryCode = countryCode;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.profilePicture = profilePicture;
        this.isDeleted = isDeleted;
    }
    static savePicture = (pictureFile) => {

    }
    static findUserById = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `SELECT id, username, about, countryCode, email, profilePicture, isDeleted FROM user WHERE id = ? AND isDeleted = false;`;
                const [rows, fields] = await connection.execute(query, [userId]);
                connection.end();
                
                if(rows && rows.length >= 1) resolve({
                    "id": rows[0].id,
                    "username": rows[0].username,
                    "email": rows[0].email,
                    "profilePicture": rows[0].profilePicture
                });
                else throw new JibberError(JibberError.errorCodes.NOT_FOUND, "User ID provided does not exist");
            } catch(err) {
                console.log(err);
                reject(err);
            }
        });
    }
    static registerUser = (username, email, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const hash = bcrypt.hashSync(password, saltRounds);
                const connection = await getConnection();

                const checkEmailQuery = `SELECT * FROM user WHERE email=?;`;
                const [existingEmailRows, existingEmailFields] = await connection.execute(checkEmailQuery, [email]);

                if(existingEmailRows.length > 0) {
                    connection.end();
                    throw new JibberError(JibberError.errorCodes.USER_EXISTS, "Email already in use");
                }
                const query = `INSERT INTO user(username, email, password) VALUES(?, ?, ?);`;
                const [rows, fields] = await connection.execute(query, [username, email, hash]);
                connection.end();
                if(rows && rows.affectedRows >= 1) resolve();
                else throw new JibberError(JibberError.errorCodes.UNEXPECTED_ERROR, "An unexpected error occured");
                
            } catch(err) {
                console.log(err);
                reject(err);
            }
        });
    }
    static loginUser = (email, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const query = `SELECT * FROM user WHERE email=?;`;
                const [rows, fields] = await connection.execute(query, [email]);
                connection.end();
                if(rows.length < 1) throw new JibberError(JibberError.errorCodes.INVALID_CREDENTIALS,  "Incorrect email or password");
                const checkPassword = bcrypt.compareSync(password, rows[0].password);
                if(!checkPassword) throw new JibberError(JibberError.errorCodes.INVALID_CREDENTIALS,  "Incorrect email or password");
                resolve({
                    "id": rows[0].id,
                    "username": rows[0].username,
                    "email": rows[0].email,
                    "profilePicture": rows[0].profilePicture
                });
            } catch(err) {
                console.log(err);
                reject(err);
            }
        });
    }
    static searchUser = q => {
        return new Promise(async (resolve, reject) => {
            try {
                let connection = await getConnection();
                const query = `SELECT id, username, profilePicture FROM user WHERE username LIKE ?;`;
                const [rows, fields] = await connection.execute(query, ['%' + q + '%']);
                connection.end();
                console.log(rows);
                resolve(rows);
            } catch(err) {
                console.log(err);
                reject(err);
            }
        });
    }
}

export default User;