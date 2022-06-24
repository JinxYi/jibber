# Jibber

(or some name that has not been taken)

[Github](https://github.com/JinxYi/jibber)

View Project Documentations [here](https://docs.google.com/document/d/1eFwATZaj2-4V_9o9R3C3Ypco-SiZR9B9Yg3qEm-5KBY/edit)

- [x] Establish database schema and data fields
- [x] Create user account using phone number or email
- [x] Sign in using email or phone number
- [ ] Implement authentication and authorization
- [ ] Search for users and start a private chat with the person
- [ ] Send a message to a chat
- [ ] Update my own message in a chat
- [ ] Delete my own message in a chat
- [ ] Send attachments, media (audio, image, video, documents)
- [ ] Create chat groups
- [ ] Add users into chat groups
- [ ] Remove users in chat groups
- [ ] Give admin rights to users in chat groups
- [ ] Remove users’ admin rights in chat groups
- [ ] Delete groups
- [ ] Leave groups
- [ ] Block users
- [ ] Video chat and audio chat with other users
- [ ] Add users to chat
- [ ] Receive background notifications
- [ ] Update profile
- [ ] Adjust message notifications for individual chat sessions
- [ ] Customise chat theme and layout

## Start Project

- Open a terminal and navigate to the root of the project
- Enter `npm install` to install all the modules needed for the backend
- Add a .env file to the root of the project directory, and add the necessary key values
- Type `npm start` to start the backend server
- Type `cd client` to navigate to the client folder, and type `npm install` once again
- Type `npm start` to start the client server

## Undertanding Websockets

Taken from [this video](https://youtu.be/gzIcGhJC8hA)

HTTP requests connect a client to a server, and when the server sends a response back to the client, the connection becomes close. To enable 2 way communication between the client and the server to make apps realtime, a thin transport layer was built on top of the TCP/IP stack.

The cient would establish an initial HTTP handshake with the server, upgrading the HTTP/1.1 protocol to the wbsocket protocol. This meant that websocket connections would be long-lived, but as a result, connection data needs to be stored. This also means the server needs to be scaled to make rooom for long-lived connections.

**To scale websockets**, I will be using HAProxy with Redis. The HAProxy acts as a reverse proxy, which will establish a connection between the client and the backend servers using a load-balancing algorithm. All incoming and outgoing request will hereby be sent to the reverse proxy first, then to the client/server. This reverse proxy essentially acts as a layer server.

1. There are 3 members in a group
2. When they are in the group page, the servers make them subscribe to a live chat channel in Redis
3. Member 1 sends 'hi'
4. The data packet is sent to the reverse proxy, which forwards the message to the server
5. Redis is responsible for publishing the message to all users in that channel by sending the data packet to the other servers connected to the chat members.
6. The servers then pushes the data packet back to all the client throught the proxy

## Authentication

Passport, JWT, Bcrypt
