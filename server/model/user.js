// import { initializeApp } from "firebase/app";
import bcrypt from "bcrypt"
import { getConnection } from "../database/databaseConfig.js";
import JibberError from "../model/jibberError.js";

const saltRounds = 11;

// const firebaseConfig = {
//   apiKey: process.env.FB_API_KEY,
//   authDomain: process.env.FB_AUTH_DOMAIN,
//   projectId: process.env.FB_PROJ_ID,
//   storageBucket: process.env.FB_STORAGE_BUCKET,
//   messagingSenderId: process.env.FB_MESSAGE_SENDER_ID,
//   appId: process.env.FB_APP_ID,
//   measurementId: process.env.FB_MEASUREMENT_ID
// };
// const firebaseConfig = {
//   apiKey: "AIzaSyCtRgGtSjWEjRCqkVPWak2cA-EoRL6DakI",
//   authDomain: "jibber-493ff.firebaseapp.com",
//   projectId: "jibber-493ff",
//   storageBucket: "jibber-493ff.appspot.com",
//   messagingSenderId: "695081393454",
//   appId: "1:695081393454:web:0ff657fc8387ba6b1a2ebf",
//   measurementId: "G-X5F4VEQ8SH"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// import { getStorage } from "firebase/storage";

// const storage = getStorage(firebaseApp);


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
                const query = `SELECT id, username, about, countryCode, email, profliePicture, isDeleted FROM user WHERE id = ?;`;
                const [rows, fields] = await connection.execute(query, [userId]);
                connection.end();
                if(rows && rows.length > 1) resolve(rows[0]);
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
                resolve();
                
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