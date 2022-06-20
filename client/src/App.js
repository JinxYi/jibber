// import logo from './logo.svg';
import './styles/theme.css';
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ChatList from './content/ChatCard';
import ChatColumn from './content/ChatColumn';
import Register from './content/Register';
import Login from './content/Login';
import SetupProfile from './content/SetupProfile';

class Main extends React.Component {
  render() {
    return (
      <div className="main-container">
        <ChatList></ChatList>
        <ChatColumn></ChatColumn>
      </div>
    );
  }
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/l" element={<Login />} />
        <Route path="/r" element={<Register />} />
        <Route path="/r/profile" element={<SetupProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
