import React from "react";
import ChatCard from "../component/ChatCard.js";

import { v4 as uuidv4 } from 'uuid';
// import moment from "moment";
import moment from "moment-timezone";
import { searchUser, getChatSessions, getMessagesByChatSession, checkPrivChatExists, createPrivChatSession } from "../api.js";
import { isFilled } from "../validation.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/main.css";

import MessageBubble from '../component/MessageBubble';

var client = new WebSocket("ws://localhost:8080/");

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.messageListRef = React.createRef(); // dummy element for scrolling chat
        this.state = {
            "items": [],
            "newChats": [],
            "searchInput": "",
            "messages": [],
            "messageInput": "",
            "chatSession": null,
            "selectedUserId": null,
            "selectedUserName": null,
            "selectedUserProfile": null,
            "isNewChat": false,
            "personal_ud": JSON.parse(localStorage.getItem("_pud"))
        };
    }


    componentDidMount = () => {
        client.onopen = _event => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = event => {
            const message = JSON.parse(event.data);
            console.log("Websocket message received:", message);

            if (this.state.personal_ud.id === message.senderId) {
                this.updateMessageBubbleStatus(message);
            }
            else {
                this.addMessageBubble(message);
            }
        };
        client.onclose = event => {
            console.log("Websocket Client Disconnected", event);
        }
        client.onerror = event => {
            console.log("Websocket Connection Error", event);
        }

        getChatSessions().then(result => {
            this.setState({ items: result.data.chatList });
        })
            .catch(error => {
                console.log("An unexpected error occured", error);
                if (error.response && error.response.status === 401) {
                    window.location.replace("/l");
                }
            });

        this.scrollToBottom(false);
    }


    addMessageBubble = (message, own = false) => {
        message.own = own;
        this.setState({ messages: [...this.state.messages, message] });
    }

    updateMessageBubbleStatus = (message) => {
        message.own = this.state.personal_ud.id === message.senderId;
        this.setState({
            messages: this.state.messages.map(el => (el.id === message.id ? Object.assign({}, el, { "status": "unread" }) : el))
        });
    }

    scrollToBottom = (smooth = true) => {
        this.messageListRef.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }

    handleKeyDownChange = (event) => {
        if (event.key === 'Enter' && this.state.messageInput.trim().length > 0) {
            if(this.state.isNewChat) {
                createPrivChatSession({"sendeeId": this.state.selectedUserId}).then(result => {
                    // this.state.chatSession
                    this.setState({ chatSession: "" });
                    const messageObject = {
                        "type": "message.send",
                        "id": uuidv4(),
                        "messageContent": this.state.messageInput.trim(),
                        "messageTime": moment().utc(),
                        "messageTimezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                        "chatSessionId": result.data.chatId
                    };
                    client.send(JSON.stringify(messageObject)); // send via ws
                    messageObject.status = "pending"; // add pending tag to display in speech bubble
                    this.addMessageBubble(messageObject, true);
                    setTimeout(() => {
                        this.setState({ messageInput: "" }); // reset message input
                        this.scrollToBottom();
                    }, 500);
                }).catch(err => {
                    console.log("Error creating chat session:", err);
                    toast.error("Could not create chat", {
                        position: "bottom-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                })
            }
            const messageObject = {
                "type": "message.send",
                "id": uuidv4(),
                "messageContent": this.state.messageInput.trim(),
                "messageTime": moment().utc(),
                "messageTimezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                "chatSessionId": this.state.chatSession
            };
            client.send(JSON.stringify(messageObject)); // send via ws
            messageObject.status = "pending"; // add pending tag to display in speech bubble
            this.addMessageBubble(messageObject, true);
            setTimeout(() => {
                this.setState({ messageInput: "" }); // reset message input
                this.scrollToBottom();
            }, 1);
        }
    }

    handleInputChange = (event) => {
        this.setState({ messageInput: event.target.value });
    }

    handleSearchInputChange = event => {
        this.setState({ searchInput: event.target.value });
        if (!isFilled(event.target.value)) return;
        searchUser(event.target.value).then(result => {
            this.setState({ newChats: result.data });
        }).catch(error => {
            console.log("An unexpected error occured", error);
            // this.setState({ formError: "Sorry, an unexpected error occured while sending request" });
        });
    }

    // TODO: make sure can create chat session then send message
    handleGetConversation = (event, key, userId, name, profilePicture, isGlobalChat = false) => {
        if (isGlobalChat) {
            checkPrivChatExists({"sendeeId": userId}).then(result => {
                // is chat does not exist, do nth
                if(result.data.exists === false) {
                    this.setState({
                        "chatSession": key,
                        "selectedUserId": userId,
                        "selectedUserName": name,
                        "selectedUserProfile": profilePicture,
                        "isNewChat": true,
                    });
                    return;
                }
                key = result.data.exists;
            });
        }
        // if chat alrdy exists
        getMessagesByChatSession(key).then(result => {
            this.setState({
                "chatSession": key,
                "selectedUserId": userId,
                "selectedUserName": name,
                "selectedUserProfile": profilePicture,
                "isNewChat": false, 
            });
            this.setState({ messages: result.data.messages });
        }).catch(error => {
            console.log("An unexpected error occured", error);
            // this.setState({ formError: "Sorry, an unexpected error occured while sending request" });
        });

    }

    // componentDidUpdate = () => {
    //     this.scrollToBottom();
    // }

    render() {
        return (
            <section className="main-container">
                {/* Left wrapper */}
                <section className="chatlist-wrapper">
                    <input className="search-user-input" type="search" placeholder="Search users" onChange={this.handleSearchInputChange} />
                    <div className="chatlist">
                        <div className="personal-chat-section">
                            {this.state.items.map(item => (
                                <ChatCard
                                    key={item.id}
                                    name={item.username}
                                    profilePicture={item.profilePicture}
                                    lastmessage={item.lastMessage}
                                    lastmessagetime={moment(item.lastMessageTime).format("h:mm a")}
                                    onClick={event => this.handleGetConversation(event, item.id, item.userId, item.username, item.profilePicture)}
                                    badge={item.badge}
                                ></ChatCard>
                            ))}
                        </div>
                        {
                            this.state.newChats.length > 0 ?
                                <div className="chatlist-header">Global Search</div>
                                : ""
                        }
                        <div className="global-chat-section">
                            {
                                this.state.newChats.map(item => (
                                    <ChatCard
                                        key={item.id}
                                        name={item.username}
                                        onClick={event => this.handleGetConversation(event, null, item.userId, item.username, item.profilePicture, true)}
                                        profilePicture={item.profilePicture}
                                    ></ChatCard>
                                ))
                            }
                        </div>
                    </div>
                </section>
                {/* Right container */}
                <section className="chat-column-wrapper">
                    <div className="chat-column">
                        <div className="chat-column-header">
                            <div className="profile-img-wrapper">
                                {
                                    this.props.profilePicture
                                        ?
                                        <img src={this.state.selectedUserProfile} alt={this.state.selectedUserName ? this.state.selectedUserName : "Profile Picture"} />
                                        :
                                        <div className="no-image">
                                            <FontAwesomeIcon className="no-image-icon" icon={faUser} />
                                        </div>
                                }
                            </div>
                            <span className="profile-user-name">{this.state.selectedUserName}</span>
                        </div>
                        <div className="chat-column-body-wrapper">
                            <div className="chat-column-body">
                                {this.state.messages.map(message => (
                                    <MessageBubble
                                        key={message.id}
                                        own={message.own || (this.state.personal_ud.id === message.senderId)}
                                        messageContent={message.messageContent}
                                        messageTime={moment(message.messageTime).tz(message.messageTimezone).format('h:mm a')}
                                        status={message.status}
                                    ></MessageBubble>
                                ))}
                                <div ref={(el) => { this.messageListRef = el; }}></div>
                            </div>
                        </div>
                        <div className="chat-column-footer">
                            <span className="button-wrapper">
                                <FontAwesomeIcon className="message-buttons" icon={faPaperclip} />
                            </span>
                            <input id="message-field" type="text" name="message-input"
                                autoComplete="off"
                                autoFocus={true}
                                placeholder="Message"
                                value={this.state.messageInput}
                                onChange={this.handleInputChange}
                                onKeyDown={this.handleKeyDownChange} />
                            <span className="button-wrapper">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </span>
                        </div>
                    </div>
                </section>
            </section>
        );
    }
}

export default Main;