import '../styles/chatcard.css';
import React from "react";


class ChatCard extends React.Component {
  // constructor(props) {
    // super(props);
    // console.log(props);
  // }

  render() {
    return (
      <section className="chatlist-chat">
        <div className="chat-wrapper-l">
          <img src={this.props.profileImg} className="chat-card-img" alt={this.props.name}/>
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

// chat list component
class ChatList extends React.Component {
  constructor(props) {
    super(props);
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
    this.state = { "items": chats };
    // this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className="chatlist">
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
    )
  }
}

export default ChatList;