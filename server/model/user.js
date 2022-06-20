// import { initializeApp } from "firebase/app";
import bcrypt from "bcrypt"
import { getConnection } from "../database/databaseConfig.js";
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
    constructor(id, username, about, countryCode, phone, email, password, salt, profilePicture, isDeleted) {
        this.id = id;
        this.username = username;
        this.about = about;
        this.countryCode = countryCode;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.salt = salt;
        this.profilePicture = profilePicture;
        this.isDeleted = isDeleted;
    }
    savePicture = (pictureFile) => {

    }
    registerUser = (username, email, password) => {
        return new Promise(async (resolve, reject) => {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);

            try {
                var connection = getConnection(false);
                connection.connect();
                const query = `INSERT INTO user(username, email, password) VALUES(?, ?, ?);`
                const [rows, fields] = await connection.execute(query, [username, email, hash]);
                connection.end();
                console.log(rows);
                resolve();
            } catch(err) {
                console.log(err);
                reject(err);
            }

        });
    }
}

export default User;