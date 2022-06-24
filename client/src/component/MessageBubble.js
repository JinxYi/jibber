import '../styles/messagebubble.css';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';


class MessageBubble extends React.Component {
    render() {
        const { id, messageContent, messageTime, own, status } = this.props;
        let wrapperClass = own ? "right" : "left";

        let statusIcon = null;
        
        switch(status) {
            case "pending": 
                statusIcon = <FontAwesomeIcon className="message-status-icon" icon={faClock} />
            break;
            case "read":
                statusIcon = <FontAwesomeIcon className="message-status-icon" icon={faCheckDouble} />
            break;
            default:
                statusIcon = <FontAwesomeIcon className="message-status-icon" icon={faCheck} />
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
        );
    }
}

export default MessageBubble;