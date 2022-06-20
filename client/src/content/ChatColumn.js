import '../styles/chatcolumn.css';
import React from "react";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
// import WebSocket from 'ws';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faCheck, faCheckDouble, faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// const element = <FontAwesomeIcon icon={faPaperclip} />


class MessageBubble extends React.Component {
    // constructor(props) {
        // super(props);
        // console.log("props");
    // }

    render() {
        const { id, messageContent, messageTime, own, status } = this.props;
        let wrapperClass = own ? "right" : "left";

        let statusIcon = null;
        
        switch(status) {
            case "pending": {
                statusIcon = <FontAwesomeIcon className="message-status-icon" icon={faClock} />
            }
            break;
            case "read": {
                statusIcon = <FontAwesomeIcon className="message-status-icon" icon={faCheckDouble} />
            }
            break;
            default: {
                statusIcon = <FontAwesomeIcon className="message-status-icon" icon={faCheck} />
            }
        }

        return (
            <div key={id} className={"message-row " + wrapperClass}>
                <div className="message-content-wrapper">
                    <div className="message-content">
                        {messageContent}
                    { own && statusIcon }
                    </div>
                    <div className="message-time">{messageTime}</div>
                </div>
            </div>
        )
    }
}

var client = new WebSocket("ws://localhost:8080/");

class ChatColumn extends React.Component {
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
        this.state = {
            "messages": messages, 
            "messageInput": ""
        };
    }

    addMessageBubble = (message) => {
        this.setState({messages: [...this.state.messages, message]});
    }

    updateMessageBubbleStatus = (message) => {
        this.setState({
            messages: this.state.messages.map(el => (el.id === message.id ? Object.assign({}, el, { "status": "unread" }) : el))
        });
    }

    scrollToBottom = (smooth = true) => {
        this.messageListRef.scrollIntoView({ behavior: smooth? "smooth" : "auto" });
    }

    handleKeyDownChange = (event) => {
        if(event.key === 'Enter' && this.state.messageInput.length > 0) {
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
        this.setState({messageInput: event.target.value});
    }

    componentDidMount = () => {
        console.log(client);
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

    // componentDidUpdate = () => {
    //     this.scrollToBottom();
    // }

    render() {
        return (
            <section className="chat-column-wrapper">
                <div className="chat-column">
                    <div className="chat-column-header">

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
                            onKeyDown={this.handleKeyDownChange}/>
                        <span className="button-wrapper">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </span>
                    </div>
                </div>
            </section>
        );
    }
}



export default ChatColumn;