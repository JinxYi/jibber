import '../styles/chatcard.css';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

class ChatCard extends React.Component {
  render() {
    return (
      <section className="chatlist-chat" onClick={this.props.onClick}>
        <div className="chat-wrapper-l">
          {
            this.props.profileImg
            ? 
            <img src={this.props.profileImg} className="chat-card-img" alt={this.props.name} />
            :
            <div className="no-image">
              <FontAwesomeIcon className="no-image-icon" icon={faUser} />
            </div>
          }
          
        </div>
        <div className="chat-wrapper-r">
          <div className="chat-wrapper-rt">
            <span className="chat-card-name">{this.props.name}</span>
            <span className="chat-card-lastmsg-time">{this.props.lastmessagetime}</span>
          </div>
          <div className="chat-wrapper-rb">
            <span className="chat-card-lastmsg">{this.props.lastmessage}</span>
            {/* {this.props.badge !== false 
            && 
            <span className="chat-card-badge-circle">
              <span className="chat-card-badge-number">{ this.props.badge }</span>
            </span>} */}
          </div>
        </div>
      </section>
    );
  }
}

export default ChatCard;