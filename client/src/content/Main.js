import React from "react";
import ChatCard from "../component/ChatCard.js";

import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { searchUser } from "../api.js";
import { isFilled } from "../validation.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import "../styles/main.css";

import MessageBubble from '../component/MessageBubble';

var client = new WebSocket("ws://localhost:8080/");

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.messageListRef = React.createRef(); // dummy element for scrolling chat
        const messages = [
            {
                "id": 1,
                "messageContent": "Im still at home",
                "messageTime": "3:51pm",
                "own": true
            },
            {
                "id": 2,
                "messageContent": "r u coming?",
                "messageTime": "4:13pm"
            },
            {
                "id": 3,
                "messageContent": "hELLO?",
                "messageTime": "4:13pm"
            },
            {
                "id": 4,
                "messageContent": "oops im still kinda on the bus",
                "messageTime": "4:20pm",
                "own": true
            },
            {
                "id": 5,
                "messageContent": "sorry",
                "messageTime": "4:21pm",
                "own": true
            },
            {
                "id": 6,
                "messageContent": "fasterrr",
                "messageTime": "4:21pm"
            },
            {
                "id": 7,
                "messageContent": "okok im on the bus",
                "messageTime": "4:28pm",
                "own": true
            },
            {
                "id": 8,
                "messageContent": "heheheh",
                "messageTime": "4:28pm",
                "own": true
            },
            {
                "id": 9,
                "messageContent": "heheheh",
                "messageTime": "4:28pm",
                "own": true
            },
            {
                "id": 10,
                "messageContent": "ok im reach the bus stop alrdy",
                "messageTime": "4:39pm",
                "own": true
            },
            {
                "id": 11,
                "messageContent": "OIHROEPDDLSKJESLEKJFSLEKFJSLEKFSELFUOYGUEPROGJWPRFOQ3RJEQHOR",
                "messageTime": "4:40pm"
            },
            {
                "id": 12,
                "messageContent": "QUICK",
                "messageTime": "4:41pm"
            },
            {
                "id": 13,
                "messageContent": "Im at the gate",
                "messageTime": "4:41pm"
            },

        ];
        const chats = [
            {
                "id": 1,
                "profileImg": "logo192.png",
                "name": "HAHAHAHHHAHAHAHAHAHHAHAHAHAHA",
                "lastMessage": "hELLO?",
                "lastMessageTime": "4:13pm",
                "badge": false
            },
            {
                "id": 3,
                "profileImg": "logo192.png",
                "name": "Ting Yi",
                "lastMessage": "Meet at 6",
                "lastMessageTime": "4:16pm",
                "badge": 1
            },
            {
                "id": 2,
                "profileImg": "logo192.png",
                "name": "Ting Fang",
                "lastMessage": "HAPPY BIRTHDAYYYYYYYYYYY",
                "lastMessageTime": "4:17pm",
                "badge": 14
            }
        ];
        this.state = {
            "items": chats,
            "newChats": [],
            "searchInput": "",
            "messages": messages,
            "messageInput": "",
            "currentUserId": null,
            "currentUserName": null,
            "currentUserProfile": null,
            "isNewChat": false
        };
    }


    componentDidMount = () => {
        client.onopen = _event => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = event => {
            const message = JSON.parse(event.data);
            console.log("Websocket message received:", message);
            this.updateMessageBubbleStatus(message);
        };

        this.scrollToBottom(false);
    }


    addMessageBubble = (message) => {
        this.setState({ messages: [...this.state.messages, message] });
    }

    updateMessageBubbleStatus = (message) => {
        this.setState({
            messages: this.state.messages.map(el => (el.id === message.id ? Object.assign({}, el, { "status": "unread" }) : el))
        });
    }

    scrollToBottom = (smooth = true) => {
        this.messageListRef.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }

    handleKeyDownChange = (event) => {
        if (event.key === 'Enter' && this.state.messageInput.length > 0) {
            const messageObject = {
                "id": uuidv4(),
                "messageContent": this.state.messageInput,
                "messageTime": moment().format('h:mm a'),
                "own": true
            };
            client.send(JSON.stringify(messageObject)); // send via ws
            messageObject.status = "pending"; // add pending tag to display in speech bubble
            this.addMessageBubble(messageObject);
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
        searchUser(event.target.value)
            .then(result => {
                this.setState({ newChats: result.data });
            })
            .catch(error => {
                console.log("An unexpected error occured", error);
                // this.setState({ formError: "Sorry, an unexpected error occured while sending request" });
            });
    }

    handleNewConversation = (event, key, name, profilePicture, isNewChat) => {
        this.setState({
            "currentUserId": key,
            "currentUserName": name,
            "currentUserProfile": profilePicture,
            "isNewChat": isNewChat
        })
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
                                    name={item.name}
                                    profileImg={item.profileImg}
                                    lastmessage={item.lastMessage}
                                    lastmessagetime={item.lastMessageTime}
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
                                        onClick={event => this.handleNewConversation(event, item.id, item.username, item.profilePicture, true)}
                                        profileImg={item.profilePicture}
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
                                this.props.profileImg
                                    ?
                                    <img src={this.state.currentUserProfile} alt={this.state.currentUserName ? this.state.currentUserName : "Profile Picture"} />
                                    :
                                    <div className="no-image">
                                        <FontAwesomeIcon className="no-image-icon" icon={faUser} />
                                    </div>
                            }
                            </div>
                            <span className="profile-user-name">{this.state.currentUserName}</span>
                        </div>
                        <div className="chat-column-body-wrapper">
                            <div className="chat-column-body">
                                {this.state.messages.map(message => (
                                    <MessageBubble
                                        key={message.id}
                                        own={message.own}
                                        messageContent={message.messageContent}
                                        messageTime={message.messageTime}
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