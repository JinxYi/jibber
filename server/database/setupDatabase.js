
import { getConnection } from "./databaseConfig.js";


const main = async () => {
  try {
    var connection = getConnection(false);
    connection.connect();

    let query = `
    CREATE DATABASE IF NOT EXISTS ?;
    USE ?;
    
    CREATE TABLE user (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL,
      about VARCHAR(200),
      countryCode VARCHAR(10),
      phone VARCHAR(20),
      email VARCHAR(255),
      password VARCHAR(255),
      profilePicture VARCHAR(255),
      isDeleted BOOLEAN DEFAULT FALSE,
      PRIMARY KEY (id)
    );
    
    CREATE TABLE chatSession (
      id INT NOT NULL AUTO_INCREMENT,
      groupName VARCHAR(255) DEFAULT NULL,
      isPrivate BOOLEAN,
      PRIMARY KEY (id)
    );
    
    CREATE TABLE member (
      id INT NOT NULL AUTO_INCREMENT,
      chatSessionId INT NOT NULL,
      userId INT NOT NULL,
      role ENUM("member", "admin") DEFAULT "member",
      PRIMARY KEY (id),
      FOREIGN KEY (chatSessionId) REFERENCES chatSession (id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES user (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
    
    CREATE TABLE message (
      id INT NOT NULL AUTO_INCREMENT,
      messageContent VARCHAR(255) NOT NULL,
      messageAttachment VARCHAR(255),
      messageAttachmentType ENUM("sticker", "picture", "audio", "video", "document"),
      messageTime TIMESTAMP NOT NULL,
      messageTimezone VARCHAR(50),
      chatSessionId INT NOT NULL,
      senderId INT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (chatSessionId) REFERENCES chatSession (id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (senderId) REFERENCES user (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
    
    CREATE TABLE messageRead (
      id INT NOT NULL AUTO_INCREMENT,
      messageId INT NOT NULL,
      userId INT NOT NULL,
      readTime TIMESTAMP NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (userId) REFERENCES user (id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (messageId) REFERENCES message (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
      `;

    const [rows, fields] = await connection.execute(query, [process.env.DB_DATABASE_NAME, process.env.DB_DATABASE_NAME]);
    
    console.log('The solution is: ', results);


    connection.end();
  } catch (err) {
    console.log(err);
  }
}
main();